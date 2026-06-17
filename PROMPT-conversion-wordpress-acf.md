# PROMPT — Convertir le site statique « Architruc & Baltaz'art » en thème WordPress 100 % éditable (Secure Custom Fields, gratuit)

> Fichier de travail interne. **Ne pas déployer ce .md sur le site.**
> Colle tout le bloc ci-dessous (à partir de « RÔLE ») dans ton agent (Claude Code dans VSCode ou Gemini dans Antigravity), avec le dossier du site ouvert.

---

## RÔLE
Tu es un intégrateur WordPress senior, spécialiste des thèmes sur-mesure et des champs personnalisés. Tu convertis un site statique HTML/CSS/JS **déjà finalisé** en un **thème WordPress classique** (PHP, pas de page builder) où une cliente non technique pourra tout modifier facilement.

> **Plugin de champs à utiliser : `Secure Custom Fields` (SCF)** — le fork **gratuit et officiel** d'ACF, hébergé sur WordPress.org. Il fournit gratuitement Repeater, Flexible Content, Gallery, Clone et Options Pages, et utilise **les mêmes fonctions qu'ACF** (`get_field()`, `the_field()`, `have_rows()`…). Dans tout ce document, chaque fois qu'il est écrit « champ ACF », utilise **Secure Custom Fields**. **N'installe PAS ACF Pro payant.**
>
> **Pérennité / portabilité (important).** Enregistre les **groupes de champs en PHP** (ou via le « Local JSON » synchronisé dans le dossier du thème), pas seulement dans la base de données. Objectif : que la configuration des champs vive **dans le thème** (versionnée par Git), et que le site puisse **basculer vers ACF sans rien perdre** en cas de besoin — SCF et ACF partagent les mêmes fonctions et le même format de données (post meta). Le **contenu** (textes, images, galeries, vidéos) reste stocké dans la base WordPress, **indépendamment du plugin** : un plugin non mis à jour n’arrête pas le site.

## OBJECTIF
Reproduire le site **à l'identique, au pixel près**, mais rendre éditable depuis l'admin WordPress : **tous les textes, toutes les images**, des **galeries où l'on peut ajouter/retirer des photos librement**, et des **vidéos sur la page « Archi Bonne Année »**. Aucune régression visuelle ni d'animation.

## ÉTAT ACTUEL DU PROJET (inspecte le dépôt avant de commencer)
Site statique en français, vanilla HTML/CSS/JS (aucun framework). Pages :
- `index.html` — Accueil
- `showrooms.html` — « Archi Concept » (showrooms)
- `archi-nous.html` — L'équipe (utilise aussi `archi-nous.css` / `archi-nous.js`)
- `nos-realisations.html` — Liste des réalisations (liens `<a href="projet.html?id=...">`)
- `projet.html` — **Page de détail d'une réalisation, rendue dynamiquement en JS** à partir de `projets-data.js` (clé `?id=`)
- `marques.html` — +80 marques
- `archi-business.html` — Offre pro (B2B) ; contient une grosse animation de **défilement horizontal au scroll**
- `archi-bonne-annee.html` — Page de vœux (c'est ici qu'il faut pouvoir **ajouter des vidéos**)
- `contact.html` — Contact + 2 showrooms + formulaire
- `mentions-legales.html`

Ressources : `style.css` (global), `script.js` (global), `archi-nous.css/js`, `projets-data.js` (données des 15 réalisations), dossier `assets/` (images, logos marques, logos clients, favicon).

Données structurées déjà présentes : JSON-LD `FurnitureStore` + `FAQPage` (accueil), `FurnitureStore` avec coordonnées GPS et horaires (contact), `BreadcrumbList` sur plusieurs pages.

## CONTRAINTES ABSOLUES (ne rien casser)
1. **Markup identique** : conserve exactement les mêmes balises, **classes et `id`** dans le HTML généré par PHP. Le JS en dépend — notamment le défilement horizontal (`#partenaires-mobilier`, `.horizontal-scroll-track`, `.bg-watermark-text`, `.scroll-indicator-bar`) et l'accordéon des secteurs. Si le markup change, l'animation casse.
2. **Réutilise `style.css` et `script.js` tels quels**, chargés proprement via `wp_enqueue_style` / `wp_enqueue_script` dans `functions.php` (pas de styles recopiés en dur dans les templates).
3. **Header et footer** : ils sont quasi identiques sur toutes les pages (seule la classe `nav-active` change selon la page courante). Factorise-les en `header.php` / `footer.php`, et gère l'état actif du menu dynamiquement.
4. Le **rendu responsive** doit rester identique (mobile/tablette/desktop).
5. **Pas de page builder** (ni Elementor ni Divi). Thème classique en PHP + Secure Custom Fields.
6. **N'invente pas de contenu** : reprends les textes et images existants du site actuel comme valeurs par défaut.

## CE QUI DOIT DEVENIR ÉDITABLE (cœur de la demande)
- **Toutes les images** du site (logos, héros, photos de section, photos d'équipe, visuels marques) → champs Image. L'attribut `alt` doit rester éditable et bien ressortir.
- **Tous les textes** visibles (titres, sous-titres, paragraphes, boutons/CTA, libellés) → champs Text / Textarea / Wysiwyg selon le cas.
- **Galeries flexibles** : sur les pages qui présentent des photos, la cliente doit pouvoir **ajouter, retirer et réordonner** des images librement → champ **Gallery** ou **Repeater**.
- **Page « Archi Bonne Année »** : pouvoir **ajouter des vidéos** (oEmbed YouTube/Vimeo **et** upload de fichier MP4) et des photos. Le mécanisme exact est précisé plus bas (Repeater « année + vidéo » calqué sur la structure existante).
- **Éléments globaux** (logo, téléphones, e-mail, adresses des 2 showrooms, horaires, liens réseaux sociaux, contenu du footer) → **Options Page**, pour qu'ils soient modifiables une seule fois et répercutés partout.

## ARCHITECTURE DES CHAMPS DEMANDÉE (Secure Custom Fields)
1. **Options Page « Réglages du site »** : logo, coordonnées (tel 1, tel 2, e-mail, 2 adresses, horaires), liens Facebook/Instagram/LinkedIn, textes/menus du footer.
2. **Custom Post Type « Réalisation »** (slug à confirmer avec moi) pour remplacer le système `projet.html?id=` :
   - Champs : **Titre**, **Catégorie** (Particulier / Professionnel), **Localisation**, **Description** (la phrase de présentation), **Photo de couverture** (la vignette affichée dans la grille « Nos Réalisations »), **Image hero** (le grand visuel en haut de la page détail — peut être différente de la couverture), **Galerie de photos** (Repeater ou Gallery : ajout / retrait / réordonnancement libre), **Lien site web externe** (optionnel).
   - **Migre les 15 réalisations** depuis `projets-data.js` vers des posts de ce CPT (écris un script d'import ou des instructions claires). L'ancien modèle (`hero` + `images[]`) n'a pas de couverture distincte : à l'import, initialise la **Photo de couverture** avec l'image `hero` (la cliente pourra la changer ensuite).
   - Crée `single-realisation.php` (détail) et adapte `nos-realisations.html` en `archive`/page listant les posts via une boucle WP. → cela supprime le rendu JS et donne une vraie page indexable par réalisation.
3. **Pages** : champs attachés à chaque page (par template ou par groupe de champs conditionné au modèle de page).
4. Utilise **Flexible Content / Repeater** pour toute zone « à rallonge » (galeries, sections vœux, listes de marques, étapes de méthode, secteurs).

## ANALYSE DU CODE EXISTANT & FRANC-PARLER (très important)
- Avant de créer les champs d’une page, **analyse d’abord son code HTML/CSS/JS réel** et **calque la structure des champs sur ce qui existe vraiment**, motif par motif. Repère les structures répétées (cartes, grilles, listes, étapes, sliders, « année + vidéo »…) et reproduis-les fidèlement en champs éditables (souvent un **Repeater** ou du **Flexible Content**), pas en blocs génériques.
- **Exemple** : « Archi Bonne Année » est une liste « année + vidéo » → ça doit devenir un Repeater année+vidéo, pas un bloc libre. Applique ce raisonnement à **chaque** page.
- **Ne force jamais une solution générique** si elle ne colle pas au rendu existant.
- Si une partie du code **n’est pas adaptée** à l’édition (structure trop rigide, contenu en dur dans le JS, markup qui rendrait l’édition bancale, ou s’il existe une meilleure approche) : **ne devine pas et ne bricole pas en silence**. **Signale-le-moi clairement, explique le problème, et propose 2-3 options** (avec avantages / inconvénients) pour qu’on décide ensemble.
- En cas de doute sur le découpage des champs ou le comportement attendu, **pose-moi la question** plutôt que de supposer.

## DÉTAIL PAGE PAR PAGE (zones à rendre éditables)
- **Accueil** : héro (titre + sous-titre + image/bouton), chaque section (titres + textes + images), FAQ (repeater question/réponse).
- **Archi Concept / Showrooms** : intro, blocs d'univers (titre + texte + galerie).
- **Archi Nous** : intro équipe + repeater « membre » (photo, nom, rôle, texte).
- **Nos Réalisations** : titre/intro + grille alimentée par le CPT Réalisation (filtres Particulier/Professionnel conservés).
- **Marques** : intro + galerie/repeater de logos (logo + nom + lien), facilement complétable.
- **Archi Business** : héro, blocs de contenu, **carrousel horizontal de marques** (repeater logos + repeater photos avec légende marque/type — garde les classes `sc-logo`, `sc-photo`, `sc-caption`), étapes de méthode (repeater), secteurs (repeater accordéon).
- **Archi Bonne Année** : reproduis **la structure actuelle** — une vidéo « à la une » pour l’année en cours, puis une grille de cartes « **année + vidéo** » (2009 → aujourd’hui). Utilise un **Repeater « Vœux par année »** : champ **Année**, champ **Vidéo** (oEmbed YouTube/Vimeo **ou** upload MP4), **miniature** optionnelle, et une case **« à la une »**. La cliente doit pouvoir ajouter une nouvelle « année + vidéo » en un clic, et la carte doit s’afficher dans le même style que les autres.
- **Contact** : textes, infos des 2 showrooms (depuis l'Options Page). **Le formulaire existant utilise Web3Forms (API externe, en JavaScript) : garde-le tel quel, il fonctionne aussi sous WordPress.** Pas besoin de Contact Form 7 / WPForms.
- **Mentions légales** : un simple Wysiwyg éditable. Garder `noindex`.

## SEO À REPRODUIRE (ne pas perdre l'existant)
- Installe un plugin SEO — **Yoast SEO** ou **RankMath** — *recommandé* : il gère les titres/metas éditables, **génère le sitemap** et les aperçus réseaux sociaux. À défaut, les balises peuvent être codées en dur dans le thème, mais ce ne serait plus modifiable par la cliente.
- Reproduis, page par page, les **`<title>`, meta description et canonique** déjà présents dans les fichiers HTML actuels (sers-t'en comme référence exacte).
- Réinjecte les **données structurées** : `FurnitureStore` (NAP, GPS, horaires) sur l'accueil/contact, `FAQPage` sur l'accueil, `BreadcrumbList` sur les pages internes. Tu peux laisser le plugin SEO gérer Breadcrumb + Organisation et ajouter le reste via le thème.
- Conserve `lang="fr"`, le favicon, les balises Open Graph, et garde `mentions-legales` en `noindex`.
- Le domaine canonique final sera **https://www.archi-truc.com/** (ne pas coder d'URL en dur ailleurs : utilise `home_url()` / `get_permalink()`).

## MÉTHODE DE TRAVAIL (je suis débutant en WordPress — guide-moi)
1. Commence par **m'expliquer en 5 lignes** ce qu'on va faire et me lister les **prérequis** à installer (LocalWP pour un WordPress local, et le plugin gratuit **Secure Custom Fields** depuis WordPress.org — il fournit Repeater/Flexible Content/Gallery/Options Pages sans licence payante).
2. Avance **page par page**. Après chaque page : dis-moi exactement comment la tester dans WordPress et **attends ma validation** avant de continuer.
3. **Pose-moi une question** chaque fois qu'un choix n'est pas évident (ex. quelles zones rendre éditables, nom des slugs) plutôt que de supposer.
4. Donne des **instructions pas à pas adaptées à un débutant** (où cliquer dans l'admin, comment créer les groupes de champs, comment importer les réalisations).
5. Fais un **point de sauvegarde Git** après chaque page qui fonctionne.
6. Si tu modifies du markup, **vérifie d'abord que le JS concerné fonctionne encore**.

## CRITÈRES D'ACCEPTATION (la conversion est réussie si)
- Le site WordPress est **visuellement identique** au site statique (desktop + mobile).
- Toutes les **animations JS** fonctionnent (défilement horizontal, accordéon, etc.).
- La cliente peut **modifier tous les textes et images**, **ajouter/retirer des photos** dans les galeries, et **ajouter des vidéos** sur « Archi Bonne Année », sans toucher au code.
- Les **15 réalisations** sont des posts du CPT, chacune avec sa propre URL, son titre et sa meta (plus aucun rendu JS).
- Les **titres / meta / canoniques / données structurées** correspondent à l'existant.

## PRÉREQUIS À ME FAIRE INSTALLER
- **LocalWP** (environnement WordPress local) — ou autre install locale.
- **Secure Custom Fields** (gratuit — depuis l'admin : Extensions › Ajouter une extension › chercher « Secure Custom Fields »). Fournit Repeater, Flexible Content, Gallery et Options Pages sans payer. *(Ne PAS prendre ACF Pro payant.)*
- Un plugin SEO : **Yoast** ou **RankMath** — *recommandé, pas obligatoire* (metas éditables + sitemap).
- *(Optionnel — non requis)* Le formulaire de contact utilise déjà **Web3Forms** (API externe) et fonctionne tel quel ; un plugin de formulaire (CF7/WPForms) n'est nécessaire que si tu préfères passer au natif WordPress.

Commence par l'étape 1 de la méthode de travail (explication + prérequis), puis attends mon feu vert.
