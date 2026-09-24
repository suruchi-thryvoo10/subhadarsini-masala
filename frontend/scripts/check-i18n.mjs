/**
 * Reports keys that each locale is missing against English, and keys it has
 * that English does not (usually a rename that was only applied in one file).
 *
 * Reads the sources with a regex rather than importing them, so it runs
 * without a TypeScript build step.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const LOCALES = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'i18n', 'locales');

const keysOf = (file) => {
  const src = readFileSync(join(LOCALES, file), 'utf8');
  return new Set([...src.matchAll(/^\s*'([a-zA-Z.]+)':/gm)].map((m) => m[1]));
};

const english = keysOf('en.ts');
let problems = 0;

for (const file of readdirSync(LOCALES).filter((f) => f.endsWith('.ts') && f !== 'en.ts')) {
  const keys = keysOf(file);
  const missing = [...english].filter((k) => !keys.has(k));
  const extra = [...keys].filter((k) => !english.has(k));
  const code = file.replace('.ts', '');

  if (!missing.length && !extra.length) {
    console.log(`  ok  ${code}  ${keys.size}/${english.size}`);
    continue;
  }

  problems += missing.length + extra.length;
  console.log(`warn  ${code}  ${keys.size}/${english.size}`);
  if (missing.length) console.log(`        missing: ${missing.join(', ')}`);
  if (extra.length) console.log(`        unknown: ${extra.join(', ')}`);
}

console.log(
  problems
    ? `\n${problems} key(s) need attention. Missing keys fall back to English at runtime.`
    : '\nAll locales cover every English key.'
);
