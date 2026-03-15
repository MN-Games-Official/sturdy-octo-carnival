'use client';

import React, { useState } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Shield, CheckCircle } from 'lucide-react';

interface RobloxKeyUploadProps {
  onSaved: () => void;
}

export function RobloxKeyUpload({ onSaved }: RobloxKeyUploadProps) {
  const { showToast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [validating, setValidating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);

  const handleValidate = async () => {
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }
    setValidating(true);
    setError(null);
    setValidated(false);

    try {
      const response = await fetch('/api/api-keys/roblox/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: apiKey }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || 'Validation failed');
      } else {
        setValidated(true);
        showToast('API key is valid!', 'success');
      }
    } catch {
      setError('Failed to validate key');
    } finally {
      setValidating(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/api-keys/roblox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: apiKey }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || 'Failed to save key');
        return;
      }
      setApiKey('');
      setValidated(false);
      showToast('Roblox API key saved!', 'success');
      onSaved();
    } catch {
      setError('Failed to save key');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-blue-400" />
          <CardTitle>Add Roblox API Key</CardTitle>
        </div>
      </CardHeader>
      <p className="text-slate-400 text-sm mb-4">
        Add your Roblox Open Cloud API key to enable group management features.
        The key is encrypted and stored securely.
      </p>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} className="mb-4" />}

      <div className="space-y-4">
        <Input
          label="API Key"
          type="password"
          placeholder="Paste your Roblox API key here..."
          value={apiKey}
          onChange={(e) => { setApiKey(e.target.value); setValidated(false); }}
        />

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleValidate} loading={validating} disabled={!apiKey}>
            Validate Key
          </Button>
          {validated && (
            <div className="flex items-center gap-1.5 text-green-400 text-sm">
              <CheckCircle size={14} />
              Key is valid
            </div>
          )}
          <Button onClick={handleSave} loading={saving} disabled={!apiKey} className="ml-auto">
            Save Key
          </Button>
        </div>
      </div>
    </Card>
  );
}
