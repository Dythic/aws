# 🎓 AWS Cloud Practitioner - Application de Cartes Mémoire

Une application interactive de flashcards pour réviser et passer l'examen AWS Cloud Practitioner CLF-C02.

## 🚀 Fonctionnalités

### 📚 Modes d'étude
- **Mode Étude** : Parcours séquentiel des 407 questions
- **Mode Quiz** : Questions mélangées pour tester vos connaissances
- **Mode Révision** : Concentration sur les questions incorrectes

### 🎯 Fonctionnalités principales
- ✅ **407 questions complètes** avec bonnes réponses validées
- 📊 **Suivi des progrès** en temps réel (précision, nombre de bonnes réponses)
- 🔖 **Marquage de questions** pour révision ultérieure
- 💾 **Sauvegarde automatique** des progrès (localStorage)
- ⌨️ **Raccourcis clavier** pour navigation rapide
- 📱 **Design responsive** (mobile, tablette, desktop)
- 🎨 **Interface moderne** aux couleurs AWS

### 🎮 Utilisation

#### Navigation
- **Sélectionner une réponse** : Cliquez sur une option ou utilisez les touches `A`, `B`, `C`, `D`, `E`
- **Vérifier la réponse** : Cliquez sur "Vérifier ma réponse" ou appuyez sur `Espace`/`Entrée`
- **Voir la réponse sans sélection** : Cliquez sur "Voir la réponse" si aucune réponse n'est sélectionnée
- **Marquer comme correct** : Bouton "Correct" ou touche `1` (mode manuel)
- **Marquer comme incorrect** : Bouton "Incorrect" ou touche `0` (mode manuel)
- **Question suivante** : Bouton "Suivant" ou `Flèche droite`
- **Question précédente** : `Flèche gauche`

#### Fonctions avancées
- **Marquer une question** : Bouton "Marquer" ou touche `M`
- **Mélanger les questions** : Bouton "Mélanger" ou touche `S`
- **Recommencer** : Bouton "Recommencer" ou touche `R`

## 🛠️ Installation et lancement

### Prérequis
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Serveur web local (pour éviter les restrictions CORS)

### Méthode 1 : Serveur Python (recommandé)
```bash
# Naviguez vers le dossier du projet
cd /chemin/vers/aws

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Ouvrez votre navigateur sur http://localhost:8000/flashcards.html
```

### Méthode 2 : Live Server (VS Code)
1. Installez l'extension "Live Server" dans VS Code
2. Ouvrez le dossier du projet
3. Clic droit sur `flashcards.html` → "Open with Live Server"

### Méthode 3 : Autres serveurs
```bash
# Node.js (avec http-server)
npx http-server -p 8000

# PHP
php -S localhost:8000
```

## 📊 Structure des fichiers

```
aws/
├── flashcards.html                    # Page principale de l'application
├── styles.css                        # Styles CSS modernes et responsive
├── script.js                         # Logique JavaScript de l'application
├── aws_questions_extracted.json      # Base de données des 407 questions
└── README.md                         # Cette documentation
```

**C'est tout !** Le repository a été nettoyé pour ne contenir que les fichiers essentiels au fonctionnement de l'application.

## 🎨 Interface utilisateur

### Dashboard supérieur
- **Question actuelle** / Total
- **Nombre de bonnes réponses**
- **Pourcentage de précision**
- **Barre de progression**

### Carte de question
- **ID et texte de la question**
- **Options de réponse** (A, B, C, D, parfois E)
- **Indication visuelle** des bonnes/mauvaises réponses
- **Système de marquage** (étoile jaune)

### Contrôles
- **Boutons principaux** : Voir réponse, Correct/Incorrect, Suivant
- **Boutons secondaires** : Mélanger, Recommencer, Marquer
- **Sélecteur de mode** : Étude/Quiz/Révision

## 🧠 Conseils pour réviser efficacement

### Stratégie d'étude recommandée
1. **Premier passage** : Mode Étude pour découvrir toutes les questions
2. **Révision ciblée** : Mode Révision pour les questions incorrectes
3. **Test final** : Mode Quiz pour simulation d'examen

### Utilisation des marquages
- ⭐ Marquez les questions **difficiles** ou **importantes**
- 🔄 Revenez régulièrement aux questions marquées
- 📝 Prenez des notes sur les concepts clés

### Raccourcis pour efficacité maximale
- Utilisez les **raccourcis clavier** pour une navigation rapide
- La **sauvegarde automatique** conserve vos progrès
- Le **mode révision** optimise votre temps d'étude

## 🔧 Fonctionnalités techniques

### Sauvegarde des progrès
- **Automatique** : Sauvegarde toutes les 30 secondes
- **Avant fermeture** : Sauvegarde avant de quitter la page
- **Durée** : 24h de conservation des données

### Performance
- **Chargement rapide** : Interface optimisée
- **Responsive** : Adaptation automatique à tous les écrans
- **Accessibilité** : Navigation clavier complète

### Debug et développement
Commandes disponibles dans la console du navigateur :
```javascript
// Aller à une question spécifique
debugFlashcards.skipToQuestion(100);

// Voir les statistiques détaillées
debugFlashcards.showStats();

// Exporter les questions marquées
debugFlashcards.exportMarked();
```

## 📈 Statistiques de l'examen CLF-C02

- **407 questions** au total
- **Distribution des réponses** équilibrée (A: 22.4%, B: 23.6%, C: 23.1%, D: 18.2%)
- **52 questions à réponses multiples** (12.8%)
- **Taux de réussite visé** : 70% minimum pour passer l'examen

## 🎯 Objectifs d'apprentissage couverts

L'application couvre tous les domaines de l'examen AWS Cloud Practitioner :
- ☁️ **Concepts cloud** (26%)
- 🔒 **Sécurité et conformité** (25%) 
- 💰 **Facturation et tarification** (16%)
- 🏗️ **Technologies principales** (33%)

## 🚨 Notes importantes

- **Précision des réponses** : Les bonnes réponses ont été validées à partir des classes CSS `correct-hidden`
- **Source** : Questions extraites du projet CLF-C02 original
- **Mise à jour** : Basé sur l'examen CLF-C02 (version 2024)

## 📞 Support

Pour toute question ou problème :
1. Vérifiez que tous les fichiers sont présents
2. Assurez-vous d'utiliser un serveur web local
3. Consultez la console du navigateur pour les erreurs
4. Rechargez la page en cas de problème de chargement

---

**Bonne chance pour votre examen AWS Cloud Practitioner ! 🎉**