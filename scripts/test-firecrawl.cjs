const fs = require('fs');
const path = require('path');

async function run() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('.env.local not found');
    process.exit(1);
  }

  const env = fs.readFileSync(envPath, 'utf8');
  const m = env.match(/VITE_FIRECRAWL_API_KEY=(.*)/);
  if (!m) {
    console.error('VITE_FIRECRAWL_API_KEY not found in .env.local');
    process.exit(1);
  }

  const key = m[1].trim();
  const url = 'https://example.com';

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${key}`,
  };

  try {
    console.log('Trying v2...');
    const v2Res = await fetch('https://api.firecrawl.dev/v2/scrape', {
      method: 'POST',
      headers,
      body: JSON.stringify({ url }),
    });
    const v2Text = await v2Res.text();
    console.log('v2 status:', v2Res.status);
    try { console.log('v2 body:', JSON.parse(v2Text)); } catch(_) { console.log('v2 body (raw):', v2Text); }
    if (v2Res.ok) return;
  } catch (err) {
    console.error('v2 request error:', err.message || err);
  }

  try {
    console.log('Trying v1...');
    const v1Res = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers,
      body: JSON.stringify({ url }),
    });
    const v1Text = await v1Res.text();
    console.log('v1 status:', v1Res.status);
    try { console.log('v1 body:', JSON.parse(v1Text)); } catch(_) { console.log('v1 body (raw):', v1Text); }
    if (v1Res.ok) return;
  } catch (err) {
    console.error('v1 request error:', err.message || err);
  }

  process.exit(1);
}

run();
