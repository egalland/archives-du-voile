# Archives du Voile

Portail immersif en français consacré au bestiaire de H. P. Lovecraft. Projet Inktober 2026, jour 10 : **Mystique**.

## Utilisation

[Ouvrir l’application](https://egalland.github.io/mystique/) · [Calendrier Inktober](https://egalland.github.io/)

Ouvrir `index.html` dans un navigateur récent, en conservant le dossier `src/` à côté. Il fonctionne hors ligne lorsque le dépôt complet est téléchargé. Activer **Son : on** pour l'ambiance, les murmures non verbaux et les sons propres aux dossiers. Les animations respectent le mouvement réduit et peuvent être désactivées.

- Trente dossiers illustrés et liens vers les récits originaux.
- Scène d'accueil en six plans, regard animé de Cthulhu, glyphes réactifs.
- Cabinet de reliques et trois grandes scènes avec premiers plans transparents.
- Notes et progression conservées dans ce navigateur.

## Organisation

- `index.html` : version web, code embarqué et illustrations chargées depuis `src/assets/`.
- `src/` : HTML, feuilles de style, scripts et illustrations extraits du même fichier pour faciliter les modifications.
- `scripts/build.py` : reconstruction de la version web depuis `src/`, avec option de fichier autonome.
- `docs/estimation.md` et `project.json` : estimations et métadonnées du projet.

Reconstruction : `python3 scripts/build.py`. Pour produire un HTML autonome avec toutes les illustrations embarquées : `python3 scripts/build.py --standalone` (sortie : `dist/Archives_du_Voile.html`). Aucun paquet npm ni backend requis.

## Crédits

Notices et interprétations autour des textes de H. P. Lovecraft, avec liens vers le H. P. Lovecraft Archive. Illustrations générées avec l'IA ; reliques, fragments et murmures originaux de ce portail. Les collaborations et emprunts littéraires sont précisés dans les dossiers.
