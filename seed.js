const data = {
  "2026-05-08": 4,
  "2026-05-07": 10,
  "2026-05-06": 8,
  "2026-05-05": 8,
  "2026-05-04": 6,
  "2026-05-03": 7,
  "2026-05-09": 2,
  "2026-05-10": 2,
  "2026-05-11": 3,
  "2026-05-12": 1,
  "2026-05-13": 2,
  "2026-05-14": 1,
  "2026-05-15": 2,
  "2026-05-16": 2,
};

const finances = {
  categories: ["Poules", "Nourriture", "Matériel"],
  depenses: [
    { date: "2026-04-26", category: "Matériel",   name: "Poulailler Vevor",    amount: 154  },
    { date: "2026-05-16", category: "Matériel",   name: "Mangeoire",           amount: 10   },
    { date: "2026-05-16", category: "Nourriture", name: "Grains",              amount: 30   },
    { date: "2026-05-09", category: "Matériel",   name: "Abreuvoir Emaüe",     amount: 10   },
    { date: "2026-05-02", category: "Nourriture", name: "Grain",               amount: 5.8  },
    { date: "2026-04-25", category: "Matériel",   name: "Piquet de grillage",  amount: 36   },
    { date: "2026-05-02", category: "Poules",     name: "Poules (11)",         amount: 20   },
  ],
  ventes: [
    { date: "2026-05-07", oeufs: 12, montant: 3 },
    { date: "2026-05-15", oeufs: 12, montant: 3 },
  ],
};

const BASE = `http://localhost:${process.env.PORT ?? 3002}/api`;

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
