const data     = require('../poulailler/src/utils/data.json');
const finances = require('../poulailler/src/utils/finances.json');

const BASE = `http://localhost:${process.env.PORT ?? 3000}/api`;

async function post(path, body) {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} → HTTP ${res.status}`);
  if (res.status === 204) return null;
  return res.json();
}

async function seed() {
  console.log('🌱 Démarrage de la migration…\n');

  for (const name of finances.categories) {
    await post('/categories', { name });
    console.log(`  ✓ Catégorie   : ${name}`);
  }

  for (const d of finances.depenses) {
    await post('/depenses', { date: d.date, category: d.category, name: d.name, amount: d.amount });
    console.log(`  ✓ Dépense     : ${d.name} (${d.date})`);
  }

  for (const v of finances.ventes) {
    await post('/ventes', { date: v.date, oeufs: v.oeufs, montant: v.montant });
    console.log(`  ✓ Vente       : ${v.oeufs} œufs — ${v.date}`);
  }

  for (const [date, count] of Object.entries(data)) {
    await post('/collectes', { date, count });
    console.log(`  ✓ Collecte    : ${date} → ${count} œuf(s)`);
  }

  console.log('\n✅ Migration terminée !');
}

seed().catch((err) => { console.error('❌', err.message); process.exit(1); });
