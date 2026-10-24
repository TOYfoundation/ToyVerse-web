# ToyVerse-Webseite

Die Webseite des **ToyVerse**: ToyChain mit dem Coin TOY, TOYPAY, ToyScan, ToyCash, TOYQUEST und ToyPost. Für Community und Presse, mit interaktiven Simulationen.

**Stand:** Grundgerüst vom 24.10.2026 auf Basis des Webseiten-Entwurfs (Version 2), Inhalte an den aktuellen Stand von `Safehaigit/toycoin` angepasst (Entscheidungen bis Nr. 133). Deutsch und Englisch fertig, die übrigen 43 der 45 Sprachen folgen.

## Grundsätze

- **Nur, was stimmt.** Zahlen und Regeln kommen aus der Spezifikation und dem Entscheidungsprotokoll in `Safehaigit/toycoin`. Bei Widerspruch gilt toycoin.
- **Keine Renditeversprechen, keine Anlageberatung.** Testnet-TOY haben keinen Wert.
- **Alte ToyCoin-Token** auf Polygon und Ethereum sind kein ToyChain-TOY (Entscheidung 63). Die Seite warnt davor und verspricht keinen Tausch.
- **Poker** nur mit Dukaten, ToyCoin-Einsätze erst nach rechtlicher Prüfung (Entscheidung 131).
- **Datenschutz:** keine Cookies, kein Tracking, keine Inhalte von Dritten. Schriften liegen auf dem eigenen Server (Fontsource, SIL Open Font License 1.1).
- **45 Sprachen** wie Wallet, TOYPAY und ToyScan (Entscheidung 103). Seiten entstehen nur für Sprachen mit Übersetzungsdatei, die anderen erscheinen in der Sprachwahl als „folgt“.

## Aufbau

| Pfad | Inhalt |
|---|---|
| `src/data/pages.ts` | alle Seiten, Gruppen, Farben, Szenen und Ablaufdiagramme |
| `src/i18n/locales/de.json`, `en.json` | alle Texte. Deutsch ist die Quelle |
| `src/i18n/sprachen.tsv`, `begriffe.tsv` | 45 Sprachen und Begriffe, aus toycoin übernommen |
| `src/data/status.json` | Meilensteine der ToyChain, aus toycoin `docs/STATUS.md` übernommen |
| `src/data/site.json` | Angaben für Impressum, Datenschutz und Kontakt. **Vor der Veröffentlichung ausfüllen** |
| `src/components/` | Seitenbausteine, `demos/` die Simulationen |
| `src/scripts/` | Browser-Skripte der Simulationen |
| `src/lib/` | Szenen, NPC-Figuren und Emissionskurve (beim Bauen und im Browser) |
| `tools/` | Abgleich mit toycoin, Prüfung der Übersetzungen und Links |

## Befehle

Voraussetzung: Node.js 22.12 oder neuer (die CI nutzt Node 24).

```bash
npm ci                 # genau die Versionen aus package-lock.json
npm run dev            # Vorschau mit Neuladen: http://localhost:4321
npm run check          # Typen und Übersetzungen
npm run build          # fertige Seite in dist/
npm run check:links    # interne Links in dist/ prüfen
npm run sync:toycoin -- ../toycoin   # Sprachen, Begriffe und Meilensteine aus toycoin übernehmen
```

## Neue Sprache hinzufügen

1. `src/i18n/locales/de.json` als `<code>.json` kopieren (Code aus `sprachen.tsv`) und übersetzen. Begriffe nach `begriffe.tsv`.
2. `npm run check` prüft, dass alle Schlüssel und Platzhalter stimmen.
3. Die Seiten der Sprache entstehen beim nächsten Build automatisch, auch rechts-nach-links für Arabisch, Urdu und Persisch.

Sicherheitswichtige Texte (Phrase, Betrug, alte Token) vor dem Veröffentlichen von Muttersprachlern prüfen lassen.

## Veröffentlichen

Die Seite ist statisch und läuft auf jedem Webserver. Für ein Unterverzeichnis (z. B. GitHub Pages unter `/toyverse-web/`) beim Bauen `BASE_PATH=/toyverse-web/` und `SITE_URL=https://…` setzen.

Vorher: `src/data/site.json` ausfüllen, Impressum und Datenschutz rechtlich prüfen lassen. GitHub Pages braucht bei einem kostenlosen Konto ein öffentliches Repository.

## Lizenz

Code: MIT. Schriften Amiri und Chakra Petch: SIL Open Font License 1.1.
