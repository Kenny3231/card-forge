# 🔧 Card Forge - Générateur de cartes Home Assistant

Un ensemble de générateurs web pour créer facilement des cartes personnalisées pour Home Assistant.

## ✨ Générateurs disponibles

### 🔥 Bubble Card Generator
- 🎯 **Configuration intuitive** : Interface simple pour personnaliser vos cartes bubble
- ⚡ **Génération en temps réel** : Le code YAML se met à jour automatiquement
- 🎨 **Système de thèmes** : 6 thèmes intégrés pour s'adapter à votre style
- 📋 **Copie instantanée** : Copiez le code généré en un clic
- 📱 **Responsive** : Fonctionne parfaitement sur mobile et desktop
- 🔧 **Template complet** : Génère des cartes bubble complètes avec sub_button

### 🚀 Générateurs à venir
- 🍄 **Mushroom Card Generator** - Pour les cartes mushroom
- 📊 **Mini Graph Card Generator** - Pour les graphiques
- 🔘 **Custom Button Card Generator** - Pour les boutons personnalisés
- 📝 **Entity Card Generator** - Pour les cartes d'entités

## 🌐 Utilisation

### En ligne
Accédez directement au générateur : [À compléter avec votre URL de déploiement]

### Installation locale
```bash
git clone https://github.com/[USERNAME]/card-forge.git
cd card-forge
# Ouvrir index.html dans votre navigateur
```

## 📖 Guide d'utilisation - Bubble Card

1. **Configurez votre carte** :
   - Nom du service (ex: Gotify, Portainer, etc.)
   - Numéro du stack Docker
   - Icônes Material Design
   - Options d'affichage

2. **Personnalisez l'apparence** :
   - Choisissez un thème
   - Ajustez les dimensions de grille
   - Activez/désactivez les éléments

3. **Copiez et utilisez** :
   - Le code YAML est généré automatiquement
   - Copiez-le dans votre configuration Home Assistant
   - Ajoutez-le à votre dashboard

## 🎨 Thèmes disponibles

- **Défaut** : Thème sombre moderne
- **Dark** : Thème ultra-sombre
- **Light** : Thème clair et lumineux
- **Midnight** : Thème noir profond
- **iOS** : Style iOS moderne
- **Material** : Design Material Google

## 📁 Structure du projet

```
card-forge/
├── index.html              # Page principale
├── generators/
│   └── bubble-card/       # Générateur Bubble Card
├── css/
│   └── style.css          # Styles et thèmes
├── js/
│   └── app.js             # Logique de l'application
└── README.md              # Documentation
```

## 🛠️ Technologies utilisées

- HTML5
- CSS3 (Variables CSS, Grid, Flexbox)
- JavaScript Vanilla (ES6+)
- Design responsive

## 📋 Exemple de code généré (Bubble Card)

```yaml
type: custom:bubble-card
card_type: button
entity: switch.stack_240_state
name: Gotify
icon: mdi:toggle-switch
show_icon: true
force_icon: false
show_state: false
sub_button:
  - entity: button.stack_240_update
    show_background: true
    state_background: true
    show_icon: true
    icon: mdi:update
    # ... configuration complète
```

## 🔮 Roadmap

- [x] Générateur Bubble Card
- [ ] Générateur Mushroom Card
- [ ] Générateur Mini Graph Card
- [ ] Générateur Custom Button Card
- [ ] Mode multi-cartes
- [ ] Import/Export de configurations
- [ ] Prévisualisation en temps réel
- [ ] Bibliothèque de templates

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Signaler des bugs
- Proposer de nouveaux générateurs
- Améliorer la documentation
- Ajouter de nouveaux thèmes

## 📝 License

[À définir]

## 🔗 Liens utiles

- [Home Assistant](https://www.home-assistant.io/)
- [Bubble Card](https://github.com/Clooos/Bubble-Card)
- [Mushroom Cards](https://github.com/piitaya/lovelace-mushroom)
- [Material Design Icons](https://materialdesignicons.com/)

---

**Note :** Card Forge est un projet communautaire pour faciliter la création de cartes personnalisées pour Home Assistant. Assurez-vous d'avoir installé les composants correspondants dans votre instance Home Assistant.