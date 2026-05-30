// gaelmousset@orange.fr / Poulailler2000
const SEED_EMAIL = 'gaelmousset@orange.fr';
const SEED_PASSWORD = 'Poulailler2000';
const MONGO_URI =
  process.env.MONGODB_URI ?? 'mongodb://localhost:27018/poulailler';

const data = {
  '2026-05-08': 4,
  '2026-05-07': 10,
  '2026-05-06': 8,
  '2026-05-05': 8,
  '2026-05-04': 6,
  '2026-05-03': 7,
  '2026-05-09': 2,
  '2026-05-10': 2,
  '2026-05-11': 3,
  '2026-05-12': 1,
  '2026-05-13': 2,
  '2026-05-14': 1,
  '2026-05-15': 2,
  '2026-05-16': 2,
  '2026-05-18': 2,
  '2026-05-17': 2,
  '2026-05-19': 3,
  '2026-05-20': 5,
  '2026-05-21': 5,
  '2026-05-22': 8,
  '2026-05-23': 8,
  '2026-05-24': 7,
  '2026-05-25': 10,
  '2026-05-26': 10,
  '2026-05-27': 6,
  '2026-05-28': 8,
  '2026-05-29': 8,
  '2026-05-30': 6,
};

const finances = {
  // Catégories globales (userId: null) → visibles pour tous les utilisateurs
  categories: ['Poules', 'Nourriture', 'Matériel'],
  depenses: [
    {
      date: '2026-04-26',
      category: 'Matériel',
      name: 'Poulailler Vevor',
      amount: 154,
    },
    { date: '2026-05-16', category: 'Matériel', name: 'Mangeoire', amount: 10 },
    { date: '2026-05-16', category: 'Nourriture', name: 'Grains', amount: 30 },
    {
      date: '2026-05-09',
      category: 'Matériel',
      name: 'Abreuvoir Emaüe',
      amount: 10,
    },
    { date: '2026-05-02', category: 'Nourriture', name: 'Grain', amount: 5.8 },
    {
      date: '2026-04-25',
      category: 'Matériel',
      name: 'Piquet de grillage',
      amount: 36,
    },
    { date: '2026-05-02', category: 'Poules', name: 'Poules (11)', amount: 20 },
  ],
  ventes: [
    { date: '2026-05-07', oeufs: 12, montant: 3 },
    { date: '2026-05-15', oeufs: 12, montant: 3 },
    { date: '2026-05-27', oeufs: 12, montant: 3 },
  ],
};

const BASE = `http://localhost:${process.env.PORT ?? 3002}/api`;

async function request(path, body, token, method = 'POST') {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${path} → HTTP ${res.status}: ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

async function getToken() {
  try {
    const result = await request('/auth/login', {
      email: SEED_EMAIL,
      password: SEED_PASSWORD,
    });
    console.log(`  ✓ Connecté en tant que ${SEED_EMAIL}`);
    return result.token;
  } catch {
    console.log(`  → Compte inexistant, création…`);
    const result = await request('/auth/register', {
      email: SEED_EMAIL,
      password: SEED_PASSWORD,
    });
    console.log(`  ✓ Compte créé : ${SEED_EMAIL}`);
    return result.token;
  }
}

async function seedGlobalCategories() {
  // Insertion directe en MongoDB — pas de userId → catégories globales pour tous
  const { MongoClient } = require('mongodb');
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const col = client.db().collection('categories');
  for (const name of finances.categories) {
    await col.updateOne(
      { name, userId: null },
      { $set: { name, userId: null } },
      { upsert: true },
    );
    console.log(`  ✓ Catégorie (globale) : ${name}`);
  }
  await client.close();
}

async function seed() {
  console.log('🌱 Démarrage de la migration…\n');

  // 1. Catégories globales directement en MongoDB (pas de userId)
  await seedGlobalCategories();

  // 2. Authentification pour les données utilisateur
  const token = await getToken();

  for (const d of finances.depenses) {
    await request(
      '/depenses',
      { date: d.date, category: d.category, name: d.name, amount: d.amount },
      token,
    );
    console.log(`  ✓ Dépense     : ${d.name} (${d.date})`);
  }

  for (const v of finances.ventes) {
    await request(
      '/ventes',
      { date: v.date, oeufs: v.oeufs, montant: v.montant },
      token,
    );
    console.log(`  ✓ Vente       : ${v.oeufs} œufs — ${v.date}`);
  }

  for (const [date, count] of Object.entries(data)) {
    await request('/collectes', { date, count }, token);
    console.log(`  ✓ Collecte    : ${date} → ${count} œuf(s)`);
  }

  console.log('\n✅ Migration terminée !');
}

seed().catch((err) => {
  console.error('❌', err.message);
  process.exit(1);
});
