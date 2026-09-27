const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.join('=').trim();
    }
  });
}

const uri = process.env.MONGODB_URI;

async function run() {
  let client;
  let connected = false;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`Connecting to MongoDB Atlas using IPv4 (Attempt ${attempt}/3)...`);
      client = new MongoClient(uri, {
        family: 4,
        connectTimeoutMS: 15000,
        serverSelectionTimeoutMS: 15000,
      });
      await client.connect();
      connected = true;
      console.log('✅ CONNECTED SUCCESSFULLY TO MONGODB ATLAS!');
      break;
    } catch (err) {
      console.warn(`Attempt ${attempt} failed: ${err.message}`);
      await new Promise(res => setTimeout(res, 2000));
    }
  }

  if (!connected) {
    console.error('❌ Could not connect after 3 attempts.');
    return;
  }

  try {
    const db = client.db('devtech_db');

    // 1. Sync career_applications (Submit Resume for Future Openings / Careers Applications)
    const careerAppsCol = db.collection('career_applications');
    const careerAppsPath = path.join(__dirname, '..', 'data', 'career_applications.json');
    if (fs.existsSync(careerAppsPath)) {
      const apps = JSON.parse(fs.readFileSync(careerAppsPath, 'utf8'));
      if (Array.isArray(apps)) {
        for (const app of apps) {
          if (app && app.id) {
            await careerAppsCol.updateOne({ id: app.id }, { $set: app }, { upsert: true });
          }
        }
        console.log(`✅ Synced ${apps.length} Career Applications (Resumes) to MongoDB Atlas 'career_applications'!`);
      }
    }

    // 2. Sync program_applications (DevTech Program Applications)
    const programAppsCol = db.collection('program_applications');
    const programAppsPath = path.join(__dirname, '..', 'data', 'program_applications.json');
    if (fs.existsSync(programAppsPath)) {
      const apps = JSON.parse(fs.readFileSync(programAppsPath, 'utf8'));
      if (Array.isArray(apps) && apps.length > 0) {
        for (const app of apps) {
          if (app && app.id) {
            await programAppsCol.updateOne({ id: app.id }, { $set: app }, { upsert: true });
          }
        }
        console.log(`✅ Synced ${apps.length} Program Applications to MongoDB Atlas 'program_applications'!`);
      }
    }

    // 3. Sync program_settings
    const settingsCol = db.collection('program_settings');
    const settingsPath = path.join(__dirname, '..', 'data', 'program_settings.json');
    if (fs.existsSync(settingsPath)) {
      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
      await settingsCol.replaceOne({ _id: 'global_settings' }, { _id: 'global_settings', ...settings }, { upsert: true });
      const rolesCount = settings.roles ? settings.roles.length : 0;
      console.log(`✅ Synced program_settings (${rolesCount} domain positions) to MongoDB Atlas!`);
    }

    // 4. Sync career_opportunities
    const oppsCol = db.collection('career_opportunities');
    const oppsPath = path.join(__dirname, '..', 'data', 'opportunities.json');
    if (fs.existsSync(oppsPath)) {
      const opps = JSON.parse(fs.readFileSync(oppsPath, 'utf8'));
      if (Array.isArray(opps)) {
        for (const opp of opps) {
          if (opp && opp.id) {
            await oppsCol.updateOne({ id: opp.id }, { $set: opp }, { upsert: true });
          }
        }
        console.log(`✅ Synced ${opps.length} career opportunities to MongoDB Atlas!`);
      }
    }

    const collections = await db.listCollections().toArray();
    console.log('\n📊 Collections currently in devtech_db:');
    for (const c of collections) {
      const cnt = await db.collection(c.name).countDocuments();
      console.log(`  - ${c.name}: ${cnt} document(s)`);
    }

  } catch (err) {
    console.error('❌ Operation Error:', err.message);
  } finally {
    await client.close();
  }
}

run();
