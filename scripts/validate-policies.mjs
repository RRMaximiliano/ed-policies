#!/usr/bin/env node
/**
 * Validates src/data/policies.json against the schema in src/types/policy.ts.
 * Enum lists below are duplicated from src/types/policy.ts on purpose (this
 * script must run without a TS toolchain). Any schema change there must be
 * mirrored here in the same commit.
 *
 * Usage: node scripts/validate-policies.mjs
 * Exit 0 on success, exit 1 with a per-entry error list on failure.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataPath = join(root, 'src', 'data', 'policies.json');

const COUNTRIES = [
  'argentina', 'bolivia', 'brazil', 'chile', 'colombia', 'costa-rica', 'cuba',
  'dominican-republic', 'ecuador', 'el-salvador', 'guatemala', 'haiti',
  'honduras', 'mexico', 'nicaragua', 'panama', 'paraguay', 'peru', 'uruguay',
  'venezuela', 'jamaica',
];

const POLICY_TYPES = [
  'cct', 'school-feeding', 'digital-inclusion', 'teacher-reform', 'vouchers',
  'higher-ed-access', 'early-childhood', 'extended-day', 'indigenous-ed',
  'tutoring', 'curriculum', 'infrastructure', 'governance',
];

const AFFECTED_POPULATIONS = [
  'early-childhood', 'primary', 'secondary', 'tertiary', 'indigenous', 'rural',
  'low-income', 'women-girls', 'teachers', 'all',
];

const EVIDENCE_QUALITIES = ['high', 'moderate', 'emerging', 'low', 'none'];

const IMPLEMENTATION_STATUSES = ['pilot', 'regional', 'national', 'scaled-down', 'ended'];

const METHODOLOGIES = [
  'rct', 'quasi-experimental', 'regression-discontinuity',
  'difference-in-differences', 'instrumental-variables', 'propensity-score',
  'descriptive', 'qualitative', 'systematic-review', 'meta-analysis',
];

const CURRENT_YEAR = new Date().getFullYear();

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function isSafeUrl(v) {
  return typeof v === 'string' && (v.startsWith('https://') || v.startsWith('http://'));
}

function validatePolicy(p, errors) {
  const err = (msg) => errors.push(`[${p.id ?? '<no id>'}] ${msg}`);

  if (!isNonEmptyString(p.id)) err('id must be a non-empty string');
  else if (!/^[a-z0-9-]+$/.test(p.id)) err(`id "${p.id}" must be lowercase kebab-case`);

  for (const field of ['name', 'summaryShort', 'summaryLong', 'mechanisms', 'impactSummary']) {
    if (!isNonEmptyString(p[field])) err(`${field} must be a non-empty string`);
  }

  if (!COUNTRIES.includes(p.country)) err(`country "${p.country}" is not a known country slug`);

  if (!Number.isInteger(p.yearStart) || p.yearStart < 1900 || p.yearStart > CURRENT_YEAR + 1) {
    err(`yearStart "${p.yearStart}" must be an integer between 1900 and ${CURRENT_YEAR + 1}`);
  }
  if (p.yearEnd !== undefined && p.yearEnd !== null) {
    if (!Number.isInteger(p.yearEnd) || p.yearEnd < p.yearStart) {
      err(`yearEnd "${p.yearEnd}" must be an integer >= yearStart`);
    }
  }

  if (typeof p.isActive !== 'boolean') err('isActive must be a boolean');
  if (p.isActive === true && Number.isInteger(p.yearEnd)) {
    // Warning only: an active policy normally has no end year.
    console.warn(`warn: [${p.id}] isActive is true but yearEnd is set`);
  }

  if (!IMPLEMENTATION_STATUSES.includes(p.implementationStatus)) {
    err(`implementationStatus "${p.implementationStatus}" must be one of: ${IMPLEMENTATION_STATUSES.join(', ')}`);
  }

  if (!Array.isArray(p.policyTypes) || p.policyTypes.length === 0) {
    err('policyTypes must be a non-empty array');
  } else {
    for (const t of p.policyTypes) {
      if (!POLICY_TYPES.includes(t)) err(`policyTypes contains unknown value "${t}"`);
    }
  }

  if (!Array.isArray(p.affectedPopulations) || p.affectedPopulations.length === 0) {
    err('affectedPopulations must be a non-empty array');
  } else {
    for (const a of p.affectedPopulations) {
      if (!AFFECTED_POPULATIONS.includes(a)) err(`affectedPopulations contains unknown value "${a}"`);
    }
  }

  if (!EVIDENCE_QUALITIES.includes(p.evidenceQuality)) {
    err(`evidenceQuality "${p.evidenceQuality}" must be one of: ${EVIDENCE_QUALITIES.join(', ')}`);
  }

  if (!Array.isArray(p.objectives) || p.objectives.length === 0 || !p.objectives.every(isNonEmptyString)) {
    err('objectives must be a non-empty array of strings');
  }

  if (!Array.isArray(p.keyOutcomes)) {
    err('keyOutcomes must be an array');
  } else {
    p.keyOutcomes.forEach((o, i) => {
      if (!isNonEmptyString(o.metric) || !isNonEmptyString(o.effect)) {
        err(`keyOutcomes[${i}] must have non-empty metric and effect`);
      }
    });
  }

  // Optional for policies without research yet; validated only when present.
  if (p.evaluations !== undefined) {
    if (!Array.isArray(p.evaluations)) {
      err('evaluations must be an array when present');
    } else {
      p.evaluations.forEach((s, i) => {
        const at = `evaluations[${i}]`;
        if (!isNonEmptyString(s.authors)) err(`${at}.authors must be a non-empty string`);
        if (!isNonEmptyString(s.title)) err(`${at}.title must be a non-empty string`);
        if (!isNonEmptyString(s.keyFinding)) err(`${at}.keyFinding must be a non-empty string`);
        if (!Number.isInteger(s.year)) err(`${at}.year must be an integer`);
        if (!METHODOLOGIES.includes(s.methodology)) err(`${at}.methodology "${s.methodology}" is unknown`);
        if (s.url !== undefined && !isSafeUrl(s.url)) err(`${at}.url must start with http(s)://`);
        if (s.doi !== undefined && !/^10\.\d{4,}\//.test(s.doi)) err(`${at}.doi "${s.doi}" is not a valid DOI`);
      });
    }
  }

  if (p.keyReferences !== undefined) {
    if (!Array.isArray(p.keyReferences)) {
      err('keyReferences must be an array when present');
    } else {
      p.keyReferences.forEach((r, i) => {
        const at = `keyReferences[${i}]`;
        if (!isNonEmptyString(r.authors)) err(`${at}.authors must be a non-empty string`);
        if (!isNonEmptyString(r.title)) err(`${at}.title must be a non-empty string`);
        if (!isNonEmptyString(r.source)) err(`${at}.source must be a non-empty string`);
        if (!Number.isInteger(r.year)) err(`${at}.year must be an integer`);
        if (r.url !== undefined && !isSafeUrl(r.url)) err(`${at}.url must start with http(s)://`);
        if (r.doi !== undefined && !/^10\.\d{4,}\//.test(r.doi)) err(`${at}.doi "${r.doi}" is not a valid DOI`);
      });
    }
  }
}

let policies;
try {
  policies = JSON.parse(readFileSync(dataPath, 'utf8'));
} catch (e) {
  console.error(`Failed to read or parse ${dataPath}: ${e.message}`);
  process.exit(1);
}

if (!Array.isArray(policies) || policies.length === 0) {
  console.error('policies.json must be a non-empty array');
  process.exit(1);
}

const errors = [];
const seenIds = new Set();
for (const p of policies) {
  if (p.id && seenIds.has(p.id)) errors.push(`[${p.id}] duplicate id`);
  if (p.id) seenIds.add(p.id);
  validatePolicy(p, errors);
}

if (errors.length > 0) {
  console.error(`FAILED: ${errors.length} error(s) in ${dataPath}\n`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`OK: ${policies.length} policies validated`);
