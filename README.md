# Implémentation d'un vote électronique

Dans le cadre d'un POC, nous avons eu à réaliser une DApp qui permet de pouvoir effectuer un vote électronique. 
Nous nous sommes basés sur une box de Truffle à savoir *_PET-SHOP_*.
Nous allons donc dans les lignes suivantes détailler comment s'y prendre pour l'exécuter.

## 1 - Clonage du répertoire git

`git clone https://github.com/stephmarcel/myErc20.git`

## 2 - Se positionner sur le répertoire cloné

`cd myErc20`

## 3 - Lancer Ganache

`ganache-cli -p 7545 -a 1 -e 10000`

 Ici on lance Ganache en ligne de commande avec les paramètres suivants : 
 -p 7545 pour faire référence au choix du port qui est 7545
 -a 1 pour demander à Ganache de générer un seul compte à partir duquel on pourra approvisionner tous les autres comptes qui seront créés pour le vote.
 
## 4 - Compiler

`truffle compile`

## 5 - Faire migrer le smart contract

`truffle migrate` ou `truffle migrate --reset`

## 6 - Lancer l'exécution

`npm run dev`
