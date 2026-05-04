# MiamList

## Présentation

La fin de la semaine arrive et avec elle, le tant attendu week-end.
Mais avant de profiter d'un repos bien mérité, un dernier obstacle se dresse devant vous : déterminer ce que vous allez manger la semaine suivante.
L'objectif de ce projet sera de créer une application mobile permettant de faire une liste de courses consacré aux produits alimentaires.

- Ce projet est réalisé en équipe de trois dans notre cadre de l'apprentissage dans le BTS SIO.
  Le projet est divisé en deux dossiers distincts, l'API et l'application Android.

---

## Technologies utilisées
- **API** : Node.js (Express)
- **Application** : Android Java
- **Base de données** : MySQL
- **Sécurité** : JWT Bearer
- **Documentation** : Swagger

---

## Cloner le dépôt
```bash
git clone https://github.com/JessyFra/SIO2_MiamList.git miamlist
cd miamlist
```

---

## API

### Prérequis
- npm
- MySQL Server

### 1. Installer les dépendances
```bash
cd api
npm install
```

### 2. Générer la clé JWT
```bash
JWT_SECRET=$(openssl rand -base64 12)
touch .env
echo "JWT_SECRET=$JWT_SECRET" >> .env
```

### 3. Initialiser la base de données
```bash
npm run init_db
```

### 4. Lancer l'API
```bash
npm run dev
```

## Application

### Prérequis
- Java
- Android Studio

### 1. Installer les dépendances
```bash
cd client
gradlew build
# Modifier l'IP dans services/ApiLinker.java
```

### 2. Émuler l'application sur téléphone
```bash
gradlew installDebug
````


## Accéder aux services
- **API** : http://localhost:3000/
- **Client** : Sur téléphone
- **Documentation API** : http://localhost:3000/api/doc/
