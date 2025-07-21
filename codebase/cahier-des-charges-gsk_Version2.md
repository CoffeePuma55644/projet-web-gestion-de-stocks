# Cahier des Charges - Projet GSK

## Projet Web de Gestion de Stocks

**Étudiant:** Camille Mokoli
**Date:** 21 juillet 2025  
**Promotion:** L1 LMD FASI
**Repository:** [projet-web-gestion-de-stocks](https://github.com/CoffeePuma55644/projet-web-gestion-de-stocks)

## 1. Introduction et Contexte

Le projet GSK (Gestion de Stocks) a été développé dans le cadre de la première année d'études universitaires à l'Université Protestante au Congo. Cette application web vise à offrir une solution simple et efficace pour la gestion de stocks, permettant aux utilisateurs de suivre leur inventaire et leurs ventes.

### 1.1 Problématique

La gestion manuelle des stocks présente plusieurs défis pour les entreprises :

- Difficulté à maintenir un inventaire à jour
- Perte de temps dans le suivi des produits
- Risques d'erreurs dans la comptabilisation
- Complexité dans l'analyse des ventes
- L'absence d'outil numériques (particulièrements les entreprises de rue)

### 1.2 Solution proposée

GSK propose une interface web intuitive permettant de gérer efficacement les stocks d'articles avec des fonctionnalités de suivi des ventes et d'export de données.

## 2. Objectifs du Projet

### 2.1 Objectif principal

Développer une application web simple et intuitive pour la gestion de stocks et le suivi des ventes.

### 2.2 Objectifs spécifiques

- Créer une interface utilisateur conviviale
- Permettre l'ajout, la modification et la suppression d'articles
- Implémenter un système de vente d'articles
- Offrir des fonctionnalités d'export de données (PDF, Excel)

## 3. Fonctionnalités

### 3.1 Gestion des articles

- Ajout de nouveaux articles
- Modification des informations d'articles existants
- Suppression d'articles
- Visualisation de l'inventaire en temps réel

### 3.2 Gestion des ventes

- Enregistrement des ventes d'articles
- Suivi des transactions
- Récapitulatif des ventes

### 3.3 Export de données

- Export au format PDF
- Export au format Excel

## 4. Spécifications Techniques

### 4.1 Technologies utilisées

- **Frontend** : HTML5, CSS3, JavaScript
- **Backend**: Uttilisation du localStorage du navigateur
- **Framework CSS** : Bootstrap 5.3.3
- **Icônes** : Bootstrap Icons
- **Animations** : AOS (Animate On Scroll)
- **Exportation** : Bibliothèques pour générer PDF et Excel

### 4.2 Structure de l'application

- Interface responsive adaptée aux différents appareils
- Navigation simple et intuitive
- Design moderne avec animations fluides
- Formulaires d'interaction pour la gestion des articles

## 5. Architecture du Projet

### 5.1 Structure des dossiers

```
projet-web-gestion-de-stocks/
├── index.html            # Page d'accueil du projet
├── codebase/             # Dossier principal du code
│   ├── app/              # Application principale
│   │   └── app.html      # Page principale de l'application
│   ├── content/          # Pages de contenu
│   │   └── contact.html  # Page de contact
│   ├── media/            # Ressources multimédias
│   │   └── images/       # Images du projet
│   └── style.css         # Feuille de style principale
```

## 6. Interfaces Utilisateur

### 6.1 Page d'accueil

- Présentation de GSK et de ses fonctionnalités
- Bouton pour accéder à l'application
- Sections explicatives avec illustrations

### 6.2 Interface de l'application

- Tableau de bord pour la gestion des stocks
- Formulaires pour l'ajout et la modification d'articles
- Interface de vente d'articles
- Visualisation des récapitulatifs de ventes

### 6.3 Ergonomie et expérience utilisateur

- Interface responsive adaptée à tous les appareils
- Animations subtiles pour améliorer l'expérience utilisateur
- Design intuitif avec utilisation d'icônes pour faciliter la navigation
- Feedback visuel pour les actions utilisateur

## 7. Fonctionnalités détaillées

### 7.1 Gestion des articles

- Formulaire d'ajout avec champs pour les informations essentielles
- Modification des caractéristiques des articles existants
- Suppression avec confirmation pour éviter les erreurs
- Visualisation claire de l'inventaire disponible

### 7.2 Processus de vente

- Sélection des articles à vendre
- Quantification des articles vendus
- Enregistrement de la transaction
- Mise à jour automatique des stocks

### 7.3 Reporting

- Génération de récapitulatifs journaliers
- Export des données au format PDF pour l'archivage
- Export au format Excel pour l'analyse et la comptabilité

## 8. Avantages et Points Forts

- **Simplicité** : Interface claire et simple
- **Rapidité** : Opérations de base réalisables en quelques clics
- **Accessibilité** : Application web accessible depuis n'importe quel navigateur
- **Design moderne** : Design dans les standards mondiaux en UI/UX design
- **Animations fluides** : Utilisation de la bibliothèque AOS pour des transitions agréables

## 9. Limites actuelles et Perspectives

### 9.1 Limites du projet actuel

- Application web front-end sans backend complexe (simulé par le localStorage avec JS et JSON)
- Stockage des données limité au navigateur de l'utilisateur
- Fonctionnalités axées sur les besoins essentiels de gestion

### 9.2 Évolutions futures possibles

- Implémentation d'un backend avec base de données
- Système d'authentification utilisateur
- Gestion multi-utilisateurs avec différents niveaux d'accès
- Fonctionnalités avancées d'analyse et de prévision
- Application mobile complémentaire
- Modèle Premium avec fonctionnalité pro tel que des graphiques, des moyennes ou l'intégration d'IA

## 10. En bref

GSK représente une solution simple mais efficace pour la gestion de stocks, particulièrement adaptée aux petites entreprises ou commerces. Le projet démontre l'application pratique des connaissances en développement web front-end, avec une attention particulière portée à l'expérience utilisateur.

Cette application, bien que limitée dans sa version actuelle, constitue une base solide pour un développement ultérieur plus complet, intégrant des fonctionnalités avancées et une architecture plus robuste.
