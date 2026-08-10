# Translations File

## Structure
`zenflow/src/i18n/translations.ts` now uses:
```ts
export const translations: Record<string, Record<string, string>>
```
Each key maps to `{ es, en, fr, ko, ja, zh, it, 'pt-BR', pt }`

## Stats
- 330 keys × 9 languages = 2,970 translation strings
- Keys preserved exactly as original, in same order
- Spanish (es) and English (en) values unchanged from original
- French (fr), Korean (ko), Japanese (ja), Chinese (zh), Italian (it), Brazilian Portuguese (pt-BR), European Portuguese (pt) added
- pt-BR vs pt-PT adapted where applicable (e.g., "Contato" BR vs "Contacto" PT, "Senha" BR vs "Palavra-passe" PT, "Assinar" BR vs "Subscrever" PT)
- Apostrophes in French/Italian/Portuguese are escaped for valid TS single-quote syntax
