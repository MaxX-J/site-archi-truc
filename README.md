# 🏗️ Guide Développeur - Architruc & Baltaz'art

Ce document explique le fonctionnement technique du site **Architruc & Baltaz'art**. Il a été rédigé pour permettre à n'importe quel développeur de reprendre le projet, de comprendre son architecture et de le modifier sans casser l'existant.

---

## 1. 📐 Architecture Globale

Le site est construit en **Vanilla (HTML / CSS / JS)**. 
Il n'y a **aucun framework lourd** (pas de React, pas de Vue, pas de Tailwind). L'objectif était d'avoir un site ultra-rapide (scores Lighthouse proches de 100/100), facilement hébergeable sur n'importe quel serveur mutualisé (OVH), et avec un SEO optimal.

### Stack Technique :
- **HTML5** Sémantique.
- **CSS3 Vanilla** avec variables natives (`:root`) et fonctions modernes (`clamp`, `grid`).
- **JavaScript Vanilla** (ES6).
- **GSAP (GreenSock)** & **ScrollTrigger** pour les animations fluides et le scroll parallax.

---

## 2. 📂 Structure des Fichiers

```text
/
├── assets/
│   ├── css/
│   │   ├── style.css         # Fichier CSS principal de développement
│   │   └── style.min.css     # Fichier CSS de production (à utiliser en ligne)
│   ├── js/
│   │   ├── script.js         # Logique UI globale, animations GSAP, menu mobile
│   │   ├── projet.js         # Moteur de génération dynamique des projets
│   │   └── data-projets.js   # Base de données (JSON) contenant tous les projets
│   ├── images/               # Médias (WebP priorisé) organisés par sections
│   └── fonts/                # Polices locales (Avenir Next World, etc.)
├── .htaccess                 # Redirections 301 (anciennes pages WP) et config serveur
├── robots.txt                # Règles d'indexation SEO
├── sitemap.xml               # Plan du site pour Google
└── *.html                    # Pages statiques du site
```

---

## 3. ⚠️ Points d'Attention Critiques (À LIRE ABSOLUMENT)

### A. Le double fichier CSS (`style.css` / `style.min.css`)
Pour des raisons de performance, le site HTML charge **uniquement** `style.min.css`. 
Si vous modifiez le design, vous devez soit modifier le fichier minifié, soit (recommandé) modifier `style.css` et le re-minifier. 
*Note : Historiquement sur ce projet, de nombreuses modifications ont été faites directement dans `style.min.css`. Assurez-vous que les deux fichiers restent synchronisés ou travaillez directement dans le `.min.css` si l'outillage de minification n'est pas en place.*

### B. Le système de cache-buster
Pour contrer le cache agressif des mobiles (notamment Safari iOS), les fichiers CSS, JS et certaines images modifiées utilisent un paramètre d'URL : 
`<link rel="stylesheet" href="assets/css/style.min.css?v=1.2">`
Si vous mettez à jour un script ou un style et qu'il n'apparaît pas sur mobile, **incrémentez ce numéro de version (`?v=1.3`)** dans les fichiers HTML.

---

## 4. 🖼️ Le Système de Portfolio Dynamique

Au lieu de créer 50 pages HTML distinctes pour chaque réalisation, le site utilise un **moteur dynamique Vanilla JS**.

**Comment ça marche ?**
1. Un visiteur clique sur un projet (ex: *Hôtel Particulier*).
2. L'URL pointe vers `projet.html?id=hotel-particulier`.
3. Le fichier `projet.js` lit l'URL, extrait l'ID `hotel-particulier`.
4. Il va chercher les données correspondantes dans l'objet JSON du fichier `data-projets.js`.
5. Il injecte dynamiquement le contenu (titre, description, galerie d'images, mission) dans le DOM de `projet.html`.

**Pour ajouter un nouveau projet :**
Il n'y a **aucun fichier HTML à créer**. Il suffit d'ouvrir `assets/js/data-projets.js` et d'ajouter un nouvel objet dans le tableau en respectant le schéma de données existant.

---

## 5. 🎨 CSS & Responsivité

- **Typographie Fluide** : Le site n'utilise presque pas de Media Queries pour le texte. Il utilise la fonction CSS `clamp(min, preferred, max)` pour que les polices grandissent et rétrécissent organiquement selon la taille de l'écran.
- **Grilles (CSS Grid)** : Les layouts complexes (comme `plan-split-layout` pour la page Archi Business) utilisent `display: grid`.
- **Défilements Horizontaux** : Sur mobile, les sections comme "Nos Réalisations" ou "Vitrine Marques" utilisent un carrousel CSS natif.
  - Propriétés clés utilisées : `overflow-x: auto`, `scroll-snap-type: x proximity`, `scroll-behavior: smooth`. (Pas de JS pour les sliders horizontaux sur mobile = performances max).

---

## 6. ✨ Animations (GSAP)

Le fichier `script.js` contient toutes les animations.
- **Fade-up** : Les éléments ayant la classe `.fade-up` apparaissent en douceur au scroll grâce à l'`IntersectionObserver` (plus léger que ScrollTrigger pour de simples apparitions).
- **Parallax & Pinning** : Certaines sections (ex: showrooms sticky sur desktop) utilisent `ScrollTrigger` de GSAP pour épingler la section de gauche pendant que la section de droite défile.

---

## 7. 🚀 Déploiement (OVH)

Le site est conçu pour être déposé directement sur un hébergement mutualisé standard.
Lors du transfert FTP via FileZilla (ou autre) :

**CE QU'IL FAUT ENVOYER :**
- Tous les fichiers `.html`
- Le dossier `assets/` complet
- Le fichier `.htaccess` (Très important pour le SEO et les redirections)
- `robots.txt` et `sitemap.xml`

**CE QU'IL NE FAUT PAS ENVOYER (Dossiers de dev) :**
- Le dossier `.git/` (Faille de sécurité si public)
- Le dossier `.vscode/` ou `.claude/` ou `.agents/`
- Tout fichier de configuration Node (`package.json`, `node_modules`, scripts JS à la racine comme `audit.js` qui ont été supprimés mais au cas où).

---
*Document généré pour la pérennité du projet.*
