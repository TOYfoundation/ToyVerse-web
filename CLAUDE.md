# CLAUDE.md – Webseite des ToyVerse

Diese Webseite stellt das ToyVerse vor (ToyChain, TOY, TOYPAY, ToyScan, ToyCash, TOYQUEST, ToyPost). Fachlich maßgeblich sind `docs/01-spezifikation.md` und `docs/02-entscheidungen.md` im Repository `TOYfoundation/toycoin`. Bei Widersprüchen gilt toycoin. Bei offenen Punkten nicht raten, sondern den Nutzer fragen.

## Sprache

- Gespräch mit dem Nutzer: Deutsch, einfach erklärt (der Nutzer ist kein Entwickler).
- Code, Bezeichner, Commit-Nachrichten, Code-Kommentare: Englisch.
- Texte der Seite: nur in `src/i18n/locales/*.json`, nie fest im Code. Deutsch ist die Quelle, Englisch der Rückfall. Begriffe nach `src/i18n/begriffe.tsv`.

## Feste Regeln für Inhalte

- Keine Renditeversprechen, keine Anlageberatung, keine Kursziele. Testnet-TOY haben keinen Wert.
- Totaler Fair Launch: keine Reserve, kein Premint (Nr. 62). Konten gehen nie verloren (Nr. 73 bis 75). Auf der ToyChain nur TOY, keine Token, keine NFTs, keine Smart Contracts (Nr. 36).
- Alte ToyCoin-Token auf Polygon und Ethereum: kein ToyChain-TOY, kein Tausch, keine Bridge (Nr. 63). Keine Funktion, die ihr Guthaben bewirbt.
- Poker und andere Spiele mit Einsatz: nur Dukaten, ToyCoin erst nach rechtlicher Prüfung (Nr. 131).
- Zahlen (Emission, Kontingent, Gebühren, Ampel) aus der Spezifikation übernehmen und in Simulationen als Beispiel kennzeichnen.
- Seite fragt nie nach Phrase oder Schlüsseln und sendet nie Transaktionen.

## Technik

- Astro (statisch), Versionen in `package.json` festgenagelt, `package-lock.json` immer mit committen.
- Keine Inhalte von Dritten laden (Schriften, Skripte, Bilder, Tracking). Neue Bibliotheken nur mit MIT-verträglicher Lizenz.
- Barrierefreiheit: Tastaturbedienung, sichtbarer Fokus, `prefers-reduced-motion` respektieren, Hell- und Dunkelmodus, ab 390 px Breite ohne waagrechtes Scrollen.
- Vor jedem Abschluss: `npm run check`, `npm run build`, `npm run check:links`. Neue Seiten oder Simulationen im Browser prüfen (Playwright ist vorinstalliert).
- `src/data/site.json` (Impressum) nie mit erfundenen Angaben füllen.
