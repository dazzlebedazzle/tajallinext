// Weight helpers for the storefront.
// Convention: weights are GRAMS, product.price is the price PER KG.
// Keep in sync with server/utils/weight.js — the server applies the same rules and is the price authority.

const MAX_MULTIPLIER = 10;

export const toGrams = (value, unit) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return NaN;
  return unit === 'kg' ? Math.round(n * 1000) : Math.round(n);
};

// grams -> number in the given unit, without float noise (750 -> 0.75)
export const fromGrams = (grams, unit) =>
  unit === 'kg' ? parseFloat((Number(grams) / 1000).toFixed(3)) : Number(grams);

// 250 -> "250 g", 1000 -> "1 kg", 1500 -> "1.5 kg"
export const formatWeight = (grams) => {
  const g = Number(grams);
  if (!Number.isFinite(g) || g <= 0) return '';
  return g >= 1000 ? `${fromGrams(g, 'kg')} kg` : `${g} g`;
};

export const defaultUnitFor = (grams) => (Number(grams) >= 1000 ? 'kg' : 'g');

const gcd = (a, b) => (b ? gcd(b, a % b) : a);

export const presetsOf = (weights) =>
  [...new Set((weights || []).map(Number).filter((g) => Number.isFinite(g) && g > 0))].sort((a, b) => a - b);

// min = smallest pack, step = GCD of packs, max = 10x largest pack
export const getWeightRules = (weights) => {
  const presets = presetsOf(weights);
  if (presets.length === 0) return { presets: [], min: 1, max: 10000, step: 1 };
  return {
    presets,
    min: presets[0],
    max: presets[presets.length - 1] * MAX_MULTIPLIER,
    step: presets.reduce(gcd),
  };
};

// Snap any typed amount to the nearest allowed weight
export const snapWeight = (grams, { min, max, step }) => {
  if (!Number.isFinite(grams)) return min;
  const snapped = Math.round(grams / step) * step;
  return Math.min(max, Math.max(min, snapped));
};

export const priceForWeight = (pricePerKg, grams) =>
  Math.round((Number(pricePerKg) * Number(grams)) / 1000);
