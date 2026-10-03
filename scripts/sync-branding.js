import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Read .env to get slug and API URL
const envPath = path.join(rootDir, '.env');
let tenantSlug = 'demo';
let apiUrl = 'https://election.digicoders.in';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const [key, ...vals] = line.split('=');
    const val = vals.join('=').trim();
    if (key.trim() === 'VITE_DEFAULT_TENANT_SLUG' && val) {
      tenantSlug = val;
    }
    if ((key.trim() === 'VITE_API_BASE_URL' || key.trim() === 'VITE_APP_URL' || key.trim() === 'VITE_PUBLIC_URL') && val) {
      apiUrl = val.replace(/\/+$/, '');
    }
  }
}

console.log(`[Branding Sync] Active Slug: ${tenantSlug}, API URL: ${apiUrl}`);

async function syncBranding() {
  try {
    const configUrl = `${apiUrl}/config?tenant=${encodeURIComponent(tenantSlug)}&tenant_slug=${encodeURIComponent(tenantSlug)}`;
    console.log(`[Branding Sync] Fetching: ${configUrl}`);
    
    const res = await fetch(configUrl);
    if (!res.ok) {
      console.warn(`[Branding Sync] API returned status ${res.status}`);
      return;
    }
    
    const json = await res.json();
    const data = json.data || json || {};
    const branding = data.branding || {};
    const tenant = data.tenant || {};

    const dynamicName = (branding.title || branding.appName || branding.leaderName || tenant.name || 'Portal').trim();
    const logoUrl = branding.logoUrl || branding.logo || branding.faviconUrl || '';
    
    console.log(`[Branding Sync] Dynamic App Name: "${dynamicName}"`);
    console.log(`[Branding Sync] Dynamic Logo URL: "${logoUrl}"`);

    // 1. Update android/app/src/main/res/values/strings.xml
    const stringsPath = path.join(rootDir, 'android/app/src/main/res/values/strings.xml');
    if (fs.existsSync(stringsPath)) {
      let stringsXml = fs.readFileSync(stringsPath, 'utf8');
      stringsXml = stringsXml.replace(
        /<string name="app_name">.*?<\/string>/,
        `<string name="app_name">${escapeXml(dynamicName)}</string>`
      );
      stringsXml = stringsXml.replace(
        /<string name="title_activity_main">.*?<\/string>/,
        `<string name="title_activity_main">${escapeXml(dynamicName)}</string>`
      );
      fs.writeFileSync(stringsPath, stringsXml, 'utf8');
      console.log(`[Branding Sync] Updated strings.xml with "${dynamicName}"`);
    }

    // 2. Update capacitor.config.json
    const capConfigPath = path.join(rootDir, 'capacitor.config.json');
    if (fs.existsSync(capConfigPath)) {
      const capConfig = JSON.parse(fs.readFileSync(capConfigPath, 'utf8'));
      capConfig.appName = dynamicName;
      fs.writeFileSync(capConfigPath, JSON.stringify(capConfig, null, 2), 'utf8');
      console.log(`[Branding Sync] Updated capacitor.config.json with appName: "${dynamicName}"`);
    }

    // 3. Update public/manifest.json
    const manifestPath = path.join(rootDir, 'public/manifest.json');
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      manifest.short_name = dynamicName;
      manifest.name = dynamicName;
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
      console.log(`[Branding Sync] Updated public/manifest.json with "${dynamicName}"`);
    }

    // 4. Download and update App Icons if logo exists
    if (logoUrl) {
      const fullLogoUrl = logoUrl.startsWith('http') ? logoUrl : `${apiUrl}${logoUrl.startsWith('/') ? '' : '/'}${logoUrl}`;
      console.log(`[Branding Sync] Updating launcher icons from: ${fullLogoUrl}`);
      execSync(`python scripts/generate_icons.py "${fullLogoUrl}"`, { stdio: 'inherit', cwd: rootDir });
    }

    // 5. Ensure Java 17 compatibility in capacitor.build.gradle
    const capBuildPath = path.join(rootDir, 'android/app/capacitor.build.gradle');
    if (fs.existsSync(capBuildPath)) {
      let capBuildContent = fs.readFileSync(capBuildPath, 'utf8');
      if (capBuildContent.includes('VERSION_21')) {
        capBuildContent = capBuildContent.replace(/VERSION_21/g, 'VERSION_17');
        fs.writeFileSync(capBuildPath, capBuildContent, 'utf8');
      }
    }

  } catch (err) {
    console.error('[Branding Sync] Error:', err);
  }
}

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

syncBranding();
