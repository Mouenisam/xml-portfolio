# Portfolio multilingue + RDFa — version statique (GitHub Pages)

Portfolio **trilingue FR / EN / AR** 100 % statique (HTML + JS + `translations.json`),
déployable sur **GitHub Pages**, avec un thème « données liées / graphe RDF » et la
page **annotée en RDFa** (FOAF + Dublin Core) pour le TP d'indexation sémantique.

## Ce qui est annoté en RDFa
- **Préfixes** déclarés sur `<html prefix="…">` : `dc:` (Dublin Core elements 1.1),
  `foaf:` (FOAF), `schema:` (schema.org).
- **Document → Dublin Core** (`<head>`) : `dc:title`, `dc:creator`, `dc:description`,
  `dc:language`, `dc:publisher`, `dc:subject`, `dc:date`.
- **Personne → FOAF** (hero, `typeof="foaf:Person" about="#me"`) : `foaf:name`,
  `foaf:givenName`, `foaf:familyName`, `foaf:mbox`, `foaf:homepage`,
  `foaf:schoolHomepage`, `foaf:account` (LinkedIn + GitHub), `foaf:topic_interest`
  (→ DBpedia « Semantic Web »), `schema:jobTitle`, `schema:knowsLanguage`.
- **Adresse → schema.org** (contact) : `schema:PostalAddress` (locality / region / country).
- Vérifié avec le moteur **W3C pyRdfa** : 40 triplets extraits (FOAF + DC + schema.org).

## Outils (section « Outils » du site)
- OpenLink Structured Data Sniffer (extension Firefox)
- Données structurées — documentation Google
- Validateur RDFa du W3C (pyRdfa)

## Fichiers
```
index.html            page RDFa (FOAF + DC), microdata/JSON-LD, hreflang, OG
translations.json     contenu (id × langue) + données perso + IDs vidéo
assets/js/boot.js     détecte la langue avant le rendu (pose lang/dir)
assets/js/main.js     traduit, met à jour méta DC/OG/JSON-LD, vidéo, change de langue
assets/css/style.css  thème « graphe RDF » + RTL
.nojekyll
```

## Détection de langue
`?lang=fr|en|ar` → `localStorage` → `navigator.languages` → défaut (`fr`).

## Vérifier les triplets RDFa
- En ligne : coller l'URL du site dans le validateur W3C
  https://www.w3.org/2012/pyRdfa/Validator.html
- Dans Firefox : extension OpenLink Structured Data Sniffer.

## Déployer sur GitHub Pages
1. Pousser les fichiers à la racine d'un dépôt.
2. Settings → Pages → Deploy from a branch → `main` / `(root)`.
3. URL : `https://Mouenisam.github.io/NOM-DU-DEPOT/`.

## Tester en local (ne pas double-cliquer index.html : fetch bloqué en file://)
```bash
cd portfolio-github
python3 -m http.server 8000
# http://localhost:8000/  puis ?lang=en  et  ?lang=ar
```

## À refaire avant le rendu
- Remplacer les 3 vidéos placeholder (`video.*`) par **ta** vidéo (consigne du sujet).
