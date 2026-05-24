# 🏠 Soumissions Toiture Pro

Application web de génération de soumissions professionnelles pour entreprises de toiture au Québec.

## Fonctionnalités

- ✅ 4 types de travaux (remplacement complet, réparation, toiture plate, bardeau asphalte)
- ✅ Matériaux et main-d'œuvre pré-remplis intelligemment selon le type de travaux
- ✅ Calcul automatique TPS (5%) + TVQ (9,975%)
- ✅ Escompte en % ou montant fixe
- ✅ Garanties fabricant suggérées automatiquement (IKO, CertainTeed, BP, Owens Corning, GAF, Soprema)
- ✅ Exclusions cochables par type de travaux
- ✅ Numérotation automatique (2026-001, 2026-002…)
- ✅ Sauvegarde automatique (localStorage)
- ✅ Export PDF professionnel (jsPDF)
- ✅ Responsive (mobile, tablette, bureau)

---

## 🚀 Déploiement sur Vercel

### Option 1 — Via GitHub (recommandé, URL stable)

```bash
# 1. Créer un dépôt GitHub (sur github.com)

# 2. Initialiser git dans le dossier du projet
cd roofing-quote
git init
git add .
git commit -m "Initial commit — Soumissions Toiture Pro"

# 3. Connecter au dépôt GitHub
git remote add origin https://github.com/VOTRE_USER/VOTRE_REPO.git
git branch -M main
git push -u origin main

# 4. Aller sur vercel.com → "New Project" → importer le dépôt GitHub
# → Cliquer "Deploy" (aucune configuration requise, vercel.json est déjà inclus)
```

### Option 2 — Via Vercel CLI (déploiement direct)

```bash
# 1. Installer Vercel CLI (une seule fois)
npm install -g vercel

# 2. Se connecter
vercel login

# 3. Déployer depuis le dossier du projet
cd roofing-quote
vercel

# Répondre aux questions :
# → Set up and deploy? Y
# → Which scope? (choisir votre compte)
# → Link to existing project? N
# → Project name? roofing-quote (ou votre choix)
# → In which directory is your code? ./
# → Override settings? N

# 4. Pour déployer en production (URL permanente)
vercel --prod
```

Votre URL ressemblera à : `https://roofing-quote.vercel.app`

---

## 📁 Structure du projet

```
roofing-quote/
├── index.html      # Application principale
├── style.css       # Styles (Sora + DM Sans)
├── app.js          # Logique complète (calculs, PDF, localStorage)
├── vercel.json     # Configuration Vercel
└── README.md       # Ce fichier
```

## 🔧 Personnalisation rapide

- **Logo** : Remplacer l'élément `.logo-placeholder` dans `index.html` par une balise `<img>`
- **Couleurs** : Modifier `--accent` et `--accent-2` dans `:root` de `style.css`
- **Taux de taxes** : Modifier `TPS_RATE` et `TVQ_RATE` dans `app.js`
- **Matériaux par défaut** : Modifier les objets `DEFAULT_MATERIALS` et `DEFAULT_LABOR` dans `app.js`

## 📝 Notes

- Toutes les données sont sauvegardées localement (localStorage du navigateur)
- Les infos de l'entreprise sont mémorisées séparément et persistent entre les soumissions
- Le PDF est généré côté client (aucun serveur requis)
