'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  defaultUnitFor,
  formatWeight,
  fromGrams,
  getWeightRules,
  snapWeight,
  toGrams,
} from '@/utils/weight';
import './WeightSelector.css';

/**
 * Pick a weight in grams, entered either in GM or KG.
 * - `value`    selected weight in grams
 * - `onChange` called with the new weight in grams (always a valid, snapped amount)
 * - `weights`  the product's pack sizes in grams (used for presets and allowed range)
 * - `rules`    optional { min, max, step } override (e.g. from the server cart)
 * - `compact`  small variant for product cards and cart lines (no preset chips)
 */
const WeightSelector = ({ value, onChange, weights, rules: rulesOverride, compact = false, disabled = false }) => {
  const rules = useMemo(() => {
    const base = getWeightRules(weights);
    return rulesOverride ? { ...base, ...rulesOverride } : base;
  }, [weights, rulesOverride]);

  const [unit, setUnit] = useState(() => defaultUnitFor(value));
  const [text, setText] = useState(() => String(fromGrams(value, defaultUnitFor(value))));

  // Keep the box in sync when the weight changes from outside (preset click, server response)
  useEffect(() => {
    setText(String(fromGrams(value, unit)));
  }, [value, unit]);

  const commit = (grams) => {
    const next = snapWeight(grams, rules);
    setText(String(fromGrams(next, unit)));
    if (next !== Number(value)) onChange(next);
  };

  const handleUnit = (nextUnit) => {
    if (nextUnit === unit) return;
    setUnit(nextUnit); // the effect re-renders the same weight in the new unit (500 g <-> 0.5 kg)
  };

  const typedGrams = toGrams(text, unit);
  const typedIsValid = Number.isFinite(typedGrams) && typedGrams > 0;
  const showsPreview = typedIsValid && typedGrams !== Number(value);

  const inputStep = unit === 'kg' ? rules.step / 1000 : rules.step;

  return (
    <div className={`weight-selector${compact ? ' weight-selector--compact' : ''}`}>
      <div className="weight-selector__row">
        <button
          type="button"
          className="weight-selector__step"
          aria-label="Decrease weight"
          disabled={disabled || Number(value) <= rules.min}
          onClick={() => commit(Number(value) - rules.step)}
        >
          −
        </button>
        <input
          className="weight-selector__input"
          type="number"
          inputMode="decimal"
          min={fromGrams(rules.min, unit)}
          max={fromGrams(rules.max, unit)}
          step={inputStep}
          value={text}
          disabled={disabled}
          aria-label={`Weight in ${unit === 'kg' ? 'kilograms' : 'grams'}`}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => commit(typedGrams)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commit(typedGrams);
            }
          }}
        />
        <div className="weight-selector__units" role="group" aria-label="Unit">
          {['g', 'kg'].map((u) => (
            <button
              key={u}
              type="button"
              className={unit === u ? 'is-active' : ''}
              aria-pressed={unit === u}
              disabled={disabled}
              onClick={() => handleUnit(u)}
            >
              {u === 'g' ? 'GM' : 'KG'}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="weight-selector__step"
          aria-label="Increase weight"
          disabled={disabled || Number(value) >= rules.max}
          onClick={() => commit(Number(value) + rules.step)}
        >
          +
        </button>
      </div>

      {!compact && rules.presets.length > 0 && (
        <div className="weight-selector__presets">
          {rules.presets.map((g) => (
            <button
              key={g}
              type="button"
              className={g === Number(value) ? 'is-active' : ''}
              disabled={disabled}
              onClick={() => commit(g)}
            >
              {formatWeight(g)}
            </button>
          ))}
        </div>
      )}

      {(showsPreview || !compact) && (
        <p className="weight-selector__hint">
          {showsPreview
            ? `= ${formatWeight(snapWeight(typedGrams, rules))}`
            : `${formatWeight(rules.min)} – ${formatWeight(rules.max)}, in steps of ${formatWeight(rules.step)}`}
        </p>
      )}
    </div>
  );
};

export default WeightSelector;
