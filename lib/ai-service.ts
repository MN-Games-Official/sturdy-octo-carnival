interface GenerationParams {
  name: string;
  description: string;
  group_id: string;
  rank: string;
  questions_count: number;
  vibe: string;
  primary_color: string;
  secondary_color: string;
  instructions?: string;
}

interface GeneratedQuestion {
  id: string;
  type: 'multiple_choice' | 'short_answer' | 'true_false';
  text: string;
  options?: string[];
  correct_answer?: number | string | boolean;
  max_score: number;
  grading_criteria?: string;
}

interface GeneratedForm {
  name: string;
  description: string;
  questions: GeneratedQuestion[];
}

export async function generateApplicationForm(params: GenerationParams): Promise<GeneratedForm> {
  const apiKey = process.env.ABACUS_AI_API_KEY;
  const baseUrl = process.env.ABACUS_AI_BASE_URL || 'https://routellm.abacus.ai/v1';
  const model = process.env.ABACUS_AI_MODEL || 'gemini-3-flash-preview';

  if (!apiKey) {
    throw new Error('Abacus AI API key not configured');
  }

  const prompt = `You are an expert form designer for Roblox group applications.
Create a ${params.questions_count}-question application form with the following specs:
- Name: ${params.name}
- Description: ${params.description}
- Target Group: ${params.group_id}
- Target Rank: ${params.rank}
- Tone: ${params.vibe}
${params.instructions ? `- Additional Instructions: ${params.instructions}` : ''}

Generate varied questions (multiple choice, short answer, true/false).
Limit short_answer questions to a maximum of 3.
For each question provide:
- id: unique string like "q1", "q2", etc.
- type: one of "multiple_choice", "short_answer", "true_false"
- text: the question text
- options: array of 4 strings (only for multiple_choice)
- correct_answer: index number 0-3 (for multiple_choice), string (for short_answer), true/false boolean (for true_false)
- max_score: 10
- grading_criteria: grading notes (only for short_answer)

Return ONLY valid JSON with this exact structure:
{"form": {"name": "...", "description": "...", "questions": [...]}}`;

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      stream: false,
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`AI API error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  const text = data.choices[0].message.content;

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found in AI response');

  const parsed = JSON.parse(jsonMatch[0]);
  return parsed.form as GeneratedForm;
}

export async function batchGradeShortAnswers(
  answers: Array<{ question: string; answer: string; criteria: string; max_score: number }>
): Promise<Array<{ score: number; feedback: string }>> {
  const apiKey = process.env.ABACUS_AI_API_KEY;
  const baseUrl = process.env.ABACUS_AI_BASE_URL || 'https://routellm.abacus.ai/v1';
  const model = process.env.ABACUS_AI_MODEL || 'gemini-3-flash-preview';

  if (!apiKey) {
    return answers.map(() => ({ score: 0, feedback: 'AI grading not configured' }));
  }

  const prompt = `Grade these short answer responses. For each, provide a score and brief feedback.
${answers.map((a, i) => `
Q${i + 1}: ${a.question}
Criteria: ${a.criteria}
Answer: ${a.answer}
Max Score: ${a.max_score}
`).join('\n')}

Return ONLY valid JSON: {"grades": [{"score": number, "feedback": "string"}, ...]}`;

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      stream: false,
      temperature: 0.3,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    return answers.map((a) => ({ score: Math.floor(a.max_score * 0.5), feedback: 'Auto-graded' }));
  }

  const data = await response.json();
  const text = data.choices[0].message.content;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return answers.map((a) => ({ score: Math.floor(a.max_score * 0.5), feedback: 'Auto-graded' }));

  const parsed = JSON.parse(jsonMatch[0]);
  return parsed.grades;
}
