# Portfolio multilingue avec annotations RDFa

Ce dépôt contient mon portfolio réalisé dans le cadre du cours de Web sémantique.

Le site est publié avec GitHub Pages et présente mon profil, mon parcours, mes compétences, mes expériences, ainsi qu'une section dédiée aux travaux et notions de Web sémantique.

## URL du site

https://mouenisam.github.io/xml-portfolio/

## Objectifs du projet

L'objectif du projet est de créer un portfolio multilingue et d'améliorer son indexation sémantique grâce à des annotations RDFa.

Le portfolio met en valeur :

- mon CV ;
- mes compétences techniques ;
- mon parcours académique et professionnel ;
- mes travaux liés au Web sémantique ;
- des métadonnées exploitables par des agents logiciels.

## Langues disponibles

Le site est disponible en trois langues :

- français ;
- anglais ;
- arabe.

L'arabe est utilisé comme langue en alphabet non latin et l'affichage droite-gauche est géré dans le site.

## Technologies utilisées

Le projet utilise :

- HTML5 ;
- CSS3 ;
- JavaScript ;
- JSON ;
- RDFa ;
- Dublin Core ;
- FOAF ;
- Schema.org.

Le fichier `translations.json` contient les textes du site dans les différentes langues.

## Annotations sémantiques RDFa

La page principale contient des annotations RDFa afin de rendre certaines informations compréhensibles par des machines.

Les espaces de noms utilisés sont notamment :

```html
prefix="dc: http://purl.org/dc/elements/1.1/ foaf: http://xmlns.com/foaf/0.1/ schema: http://schema.org/"
