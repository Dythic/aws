# 🚀 Configuration GitHub Pages

## Étapes pour activer GitHub Pages

### 1. Activer GitHub Pages manuellement
1. Allez sur votre repository GitHub : `https://github.com/Dythic/aws`
2. Cliquez sur **Settings** (Paramètres)
3. Descendez jusqu'à la section **Pages** dans le menu de gauche
4. Dans **Source**, sélectionnez **GitHub Actions**
5. Cliquez sur **Save**

### 2. Déclencher le déploiement
Une fois Pages activé, vous pouvez :
- **Option A** : Faire un commit et push vers `main`
- **Option B** : Aller dans **Actions** → **Deploy AWS Flashcards to GitHub Pages** → **Run workflow**

### 3. Vérifier le déploiement
- Le site sera accessible à : `https://dythic.github.io/aws/`
- Vérifiez le statut dans l'onglet **Actions**

## Résolution des problèmes courants

### Erreur "Pages not enabled"
→ Assurez-vous d'avoir suivi l'étape 1 ci-dessus

### Erreur 404 après déploiement
→ Attendez 5-10 minutes, le déploiement peut prendre du temps

### Fichiers non trouvés
→ Vérifiez que tous les fichiers sont présents dans le repository