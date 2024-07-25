import { Mods } from '@/types/types';

const rolls = [999, 999, 1000, 1000, 1000, 1000];
const odds = [
  { 0: 333, 1: 999 },
  { 1: 666, 2: 999 },
  { 1: 300, 2: 800, 3: 1000 },
  { 1: 100, 2: 650, 3: 1000 },
  { 2: 500, 3: 1000 },
  { 2: 300, 3: 1000 }
];

export default function calculateSuccessChance(
  desiredPrefixes: Set<string>,
  desiredSuffixes: Set<string>,
  item1Mods: Mods,
  item2Mods: Mods
): number {
  let hits = 0;
  const simulations = 10000;

  for (let i = 0; i < simulations; i++) {
    const prefixSuccess = desiredPrefixes.size === 0 || simulateRecombination(Array.from(desiredPrefixes), item1Mods.prefixes, item2Mods.prefixes, 'prefixes');
    const suffixSuccess = desiredSuffixes.size === 0 || simulateRecombination(Array.from(desiredSuffixes), item1Mods.suffixes, item2Mods.suffixes, 'suffixes');

    if (prefixSuccess && suffixSuccess) {
      hits++;
    }
  }
  console.log('sim done')
  return hits / simulations;
}

function simulateRecombination(
  desiredMods: string[],
  mods1: string[],
  mods2: string[],
  type: 'prefixes' | 'suffixes'
): boolean {
  const allMods = Array.from(new Set([...mods1, ...mods2].filter(Boolean)));
  const uniqueModCount = allMods.length;

  if (uniqueModCount === 0) return false;
  if (desiredMods.length > uniqueModCount) return false;

  const rng = Math.floor(Math.random() * rolls[Math.min(5, uniqueModCount - 1)]) + 1;
  let modCount = 0;

  for (const [key, val] of Object.entries(odds[Math.min(5, uniqueModCount - 1)])) {
    if (rng <= val) {
      modCount = Math.min(parseInt(key), uniqueModCount, 3);
      break;
    }
  }

  if (modCount < desiredMods.length) return false;

  const keptMods = new Set<string>();
  while (keptMods.size < modCount) {
    const randomMod = allMods[Math.floor(Math.random() * allMods.length)];
    keptMods.add(randomMod);
  }

  for (const mod of desiredMods) {
    if (!keptMods.has(mod)) return false;
  }

  return true;
}