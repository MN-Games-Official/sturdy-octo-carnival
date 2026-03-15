export class RobloxService {
  constructor(private apiKey: string) {}

  async getMembership(groupId: string, userId: string) {
    const filter = encodeURIComponent(`user=='users/${userId}'`);
    const url = `https://apis.roblox.com/cloud/v2/groups/${groupId}/memberships?maxPageSize=1&filter=${filter}`;

    const response = await fetch(url, {
      headers: { 'x-api-key': this.apiKey },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Failed to get membership: ${error.message || response.status}`);
    }

    const data = await response.json();
    return data.groupMemberships?.[0] || null;
  }

  async getRolesMap(groupId: string): Promise<Record<number, number>> {
    const response = await fetch(
      `https://groups.roblox.com/v1/groups/${groupId}/roles`
    );

    if (!response.ok) {
      throw new Error(`Failed to get roles: ${response.status}`);
    }

    const data = await response.json();
    const map: Record<number, number> = {};

    for (const role of data.roles || []) {
      map[role.rank] = role.id;
    }

    return map;
  }

  async promoteUser(groupId: string, membershipId: string, roleId: string) {
    const url = `https://apis.roblox.com/cloud/v2/groups/${groupId}/memberships/${membershipId}`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role: `groups/${groupId}/roles/${roleId}`,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Promotion failed: ${error.message || response.status}`);
    }

    return response.json();
  }

  async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetch('https://apis.roblox.com/cloud/v2/users/me', {
        headers: { 'x-api-key': this.apiKey },
      });
      return response.ok || response.status === 403;
    } catch {
      return false;
    }
  }
}
