const fs = require('fs');
const file = 'frontend/src/lib/api.ts';
let content = fs.readFileSync(file, 'utf8');

// Insert PLAYER_BASE_URL
content = content.replace(
  "export const AUTH_BASE_URL = `${BASE_URL}/auth`;",
  "export const AUTH_BASE_URL = `${BASE_URL}/auth`;\nexport const PLAYER_BASE_URL = `${BASE_URL}/player`;"
);

// Append Player endpoints at the end
content += `

// ── Player Follow Endpoints ──────────────────────────────────────

export async function fetchAllPlayers() {
    const res = await fetch(\`\${PLAYER_BASE_URL}\`);
    if (!res.ok) throw new Error('Failed to fetch players');
    return res.json();
}

export async function fetchMyPlayers() {
    const res = await fetch(\`\${PLAYER_BASE_URL}/my-list\`, {
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch user players');
    return res.json();
}

export async function fetchMyFeed() {
    const res = await fetch(\`\${PLAYER_BASE_URL}/my-feed\`, {
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch feed');
    return res.json();
}

export async function followPlayer(id: string) {
    const res = await fetch(\`\${PLAYER_BASE_URL}/follow/\${id}\`, {
        method: 'POST',
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to follow player');
    return res.json();
}

export async function unfollowPlayer(id: string) {
    const res = await fetch(\`\${PLAYER_BASE_URL}/follow/\${id}\`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to unfollow player');
    return res.json();
}
`;

fs.writeFileSync(file, content, 'utf8');
