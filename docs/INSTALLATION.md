# FourTimer — installer sur iPad / Android, hors ligne

## 1. Mettre l'app en ligne une seule fois (gratuit, 10 min)

Une appli « raccourci » (PWA) doit être servie en HTTPS **une fois** pour s'installer. Ensuite elle fonctionne sans Internet.

1. Crée un dépôt GitHub (ex. `fourtimer`) et envoie ces fichiers à la racine :
   `index.html`, `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`.
2. Dépôt → Settings → Pages → Branch `main` / `(root)` → Save.
3. L'adresse sera `https://TON-COMPTE.github.io/fourtimer/`.

## 2. Installer sur la tablette (avec du réseau, une seule fois)

**iPad (cible principale)**
1. Ouvre l'adresse dans **Safari** (pas Chrome : seul Safari peut installer une web-app sur iPad).
2. Touche **Partager** (carré avec une flèche) → **« Sur l'écran d'accueil »** → Ajouter.
3. Ouvre FourTimer depuis l'icône **une fois en ligne** (pour charger les fichiers), puis coupe le Wi-Fi pour vérifier : ⚙ → « Installer sur la tablette » doit afficher *Fonctionne hors ligne : prêt ✓*.

**Android** : Chrome → ⋮ → **Installer l'application**.

L'app s'ouvre ensuite en plein écran, comme une vraie appli. Tes préréglages et minuteurs sont gardés sur la tablette.

Mise à jour : change `VERSION` dans `sw.js`, renvoie les fichiers, rouvre l'app en ligne.

## 3. Limites à connaître (iPad)

- Version web : les minuteurs restent **justes** même app fermée, mais **l'alarme ne sonne que si l'app est ouverte** (ou récemment en arrière-plan avec le mode veille audio). Garde l'iPad branché, écran allumé (bouton œil).
- Les **voix** (synthèse vocale) sont fournies par l'iPad : Réglages iPad → Accessibilité → Contenu énoncé → Voix, pour télécharger de meilleures voix françaises.
- Pour sonner **app fermée / écran verrouillé** : emballage natif ci-dessous.

## 4. Alertes app fermée = emballage natif (Capacitor)

Le code est déjà prêt : si l'app détecte Capacitor, elle programme une notification système pour chaque minuteur.

```bash
mkdir fourtimer-app && cd fourtimer-app
npm init -y
npm i @capacitor/core @capacitor/cli @capacitor/local-notifications @capacitor/android @capacitor/ios
npx cap init FourTimer com.funappi.fourtimer --web-dir=www
mkdir www && cp ../index.html ../manifest.webmanifest ../icon-*.png ../apple-touch-icon.png www/
npx cap add android
npx cap add ios          # nécessite un Mac + Xcode
npx cap sync
```

**Android (gratuit)** : `npx cap open android` → Build APK → installer. Ajouter dans `AndroidManifest.xml` : `POST_NOTIFICATIONS` et `USE_EXACT_ALARM` (réservée aux applis minuteur/alarme).

**iPad** : `npx cap open ios` → Xcode → iPad en USB → Run. Compte Apple gratuit : l'app expire au bout de 7 jours ; durable / TestFlight / App Store = Apple Developer Program, 99 $/an. Réglages iPad → Notifications → FourTimer : autoriser alertes + sons (le mode Concentration peut les masquer).

## 5. Test

⚙ → « Tester (10 s) », puis mets l'app en arrière-plan. Fais-le sur les vraies tablettes du restaurant avant de vendre.
