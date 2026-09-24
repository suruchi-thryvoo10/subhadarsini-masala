# Translations

English plus eleven Indian languages: Hindi, Odia, Bengali, Telugu, Marathi,
Tamil, Gujarati, Kannada, Malayalam, Punjabi and Urdu. English is the default;
the reader's choice is kept in `localStorage` under `subhadarshini.language`.

## What is translated, and what is not

Only **interface chrome** lives in these files — navigation, buttons, section
headings, empty and error states.

**Product and brand content is never translated.** Product names, descriptions,
variant labels, quality claims, batch and lab wording, the founder and
co-founder biographies and the recipe text all come from the database and
render exactly as they were authored. Machine-translating any of that would put
unchecked claims about food purity, certification and named people in front of
readers who cannot compare them against the English. If those need to exist in
another language, they should be translated per field in the database by a
person, not generated here.

## Review status

`reviewed` in `languages.ts` records whether a speaker of the language has
checked the strings. Only English is marked reviewed; every other locale is
offered with a visible `beta` label in the switcher.

To mark a language reviewed: have a speaker read `locales/<code>.ts` against
`locales/en.ts`, correct what is wrong, then set `reviewed: true`.

## Adding or changing a string

1. Add the key to `locales/en.ts` — it is the source of truth and defines the
   `TranslationKey` union, so a typo in a `t()` call fails the type check.
2. Add it to the other locales. Missing keys are not an error: they fall back
   to English at runtime.
3. Use it with `const t = useT(); t('nav.products')`.

`npm run check:i18n` lists keys missing from each locale.

## Adding a language

Add an entry to `LANGUAGES` in `languages.ts`, create `locales/<code>.ts`, and
add its dynamic import to `LOADERS` in `LanguageContext.tsx`. Each dictionary
is a separate bundle chunk, so a new language costs nothing to readers who do
not select it. Set `dir: 'rtl'` where appropriate. The provider deliberately does not yet
apply it to `<html>`: with the content still in English, mirroring the document
right-aligns all of it and misplaces its punctuation. A short right-to-left run
inside a left-to-right document already renders correctly, so the Urdu labels
read properly as they are. `LanguageContext.tsx` says where to turn it on once
the content is translated.
