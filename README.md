# MobileMar 

## Description
Ce projet est un système de vente en ligne de matériel de téléphones mobiles, basé sur une architecture de microservices, développé en TypeScript pour le backend.

## Fonctionnalités
Le projet comprend les fonctionnalités suivantes, divisées en microservices :

### Service Product :
- Ajout, modification et suppression de produits (pour les administrateurs)
- Recherche et affichage de détails de produits (pour les utilisateurs)

### Service Orders :
- Ajout de produits au panier
- Passage de commande
- Consultation de l'historique des commandes (pour les utilisateurs)
- Visualisation de toutes les commandes et modification de leur statut (pour les administrateurs)

### Service Cart :
- Ajout, suppression et modification de la quantité des articles dans le panier (pour les utilisateurs)

### Service Payment :
- Sélection d'une méthode de paiement
- Finalisation du paiement
- Consultation des transactions réussies (pour les utilisateurs)
- Gestion des passerelles de paiement (pour les administrateurs)

### Authentification  :
- Création de compte
- Connexion avec email et mot de passe (pour les utilisateurs)
- Création de comptes administrateurs
- Gestion des rôles et des autorisations (pour les administrateurs)

## Technologies Utilisées
- Backend: TypeScript, Node.js, Express.js, Nest.js
- Base de données: [Choix de la base de données pour chaque servise, par exemple MongoDB]
- Authentification: Keycloak

## Instructions d'Installation et d'Exécution
1. Cloner ce dépôt.
2. Installer les dépendances avec `npm install`.
3. Configurer la base de données selon les instructions fournies.
4. Lancer le serveur avec `npm start`.

## Contributions
Les contributions sont les bienvenues. Avant de contribuer, veuillez d'abord discuter des changements que vous souhaitez apporter via un problème ou un e-mail avec les propriétaires du projet.
