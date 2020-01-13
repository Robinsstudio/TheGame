# Documentation de l'API RESTful du projet The Game
L'API est composée d'un ensemble de routes matérialisant des ressources et associées à des verbes HTTP. Le corps des requêtes est en JSON.

Le tableau suivant énumère les différentes routes de l'API ainsi que les verbes avec lesquels elles sont compatibles.

Route               | GET | POST | PUT | DELETE
--------------------|-----|------|-----|-------
api/account         | ✗   | ✓   | ✓   | ✓
api/authentication  | ✓   | ✗   | ✓   | ✓
api/player/:id/login| ✓   | ✗   | ✗   | ✗
api/game            | ✗   | ✓   | ✗   | ✗
api/game/:id/actions| ✓   | ✗   | ✗   | ✗
api/game/:id/tour   | ✗   | ✗   | ✓   | ✗
api/game/:id/card   | ✓   | ✗   | ✓   | ✗
api/game/:id/ready  | ✗   | ✗   | ✓   | ✗
api/game/:id/player | ✗   | ✗   | ✓   | ✓
api/games/playable  | ✓   | ✗   | ✗   | ✗
api/games/ended     | ✓   | ✗   | ✗   | ✗

Lorsqu'un joueur s'authentifie, un jeton unique est généré sous la forme d'un JSON Web Token (JWT). Ce token doit être stocké dans un cookie pour s'authentifier auprès des requêtes qui le nécessitent. Les propriétés du token sont listées dans le tableau suivant.

Propriété| Description              | Type de données |
---------|--------------------------|-----------------|
idPlayer | id du joueur authentifié | String          |

La plupart des routes demandent à l'utilisateur si celui-ci est authentifier avant de lui permettre de lancer la fonction associée à la requête. Ces routes lanceront donc la fonction isAuthenticated avant la fonction principale. Si le token fourni avec la requête est faux ou a expiré la fonction suivante ne pourra pas être lancée.



**Créer un compte**
----

* **URL**

    /api/account

* **Method:**
    `POST`
  
* **URL Params**

* **Query Params**

* **Data Params**

    `login=[String]`
    `password=[String]`
    `email=[String]`

   **Required:**
 
    `login=[String]`
    `password=[String]`
    `email=[String]`


* **Success Response:**
  

  * **Code:** 201 
    **Content:** ` `
 
* **Error Response:**

  * **Code:** 409 
    **Content:** `"Pseudo déjà utilisé"`


**Modifier ses informations de comptes**
----
    Permet de modifier les champs login, email ou password.
* **URL**

    /api/account

* **Method:**
    `PUT`
  
* **URL Params**

* **Query Params**

* **Data Params**

    `login=[String]`
    `oldPassword=[String]`
    `newPassword=[String]`
    `email=[String]`

   **Optional:**
 
    `login=[String]`
    `oldPassword=[String]`
    `newPassword=[String]`
    `email=[String]`


* **Success Response:**
  

  * **Code:** 200 
    **Content:** ` `
 
* **Error Response:**

  * **Code:** 409 
    **Content:** `"Pseudo déjà utilisé"`

    OR
 * **Code:** 401 
    **Content:** `""`

**Supprimer son compte**
----
* **URL**

    /api/account

* **Method:**
    `DELETE`
  
* **URL Params**

* **Query Params**

* **Data Params**

* **Success Response:**
  

  * **Code:** 200 
    **Content:** ` `
 
* **Error Response:**

  * **Code:** 500 
    **Content:** `"Pseudo déjà utilisé"`

**Obtenir le pseudo d'un joueur à partir de son id**
----
* **URL**

    /api/player/:id/login

* **Method:**
    `PUT`
  
* **URL Params**
    `id=[String]`
    ** Required ** 
    `id=[String]`
* **Query Params**

* **Data Params**


* **Success Response:**
  

  * **Code:** 200 
    **Content:** `userLogin`
 
* **Error Response:**

  * **Code:** 412 
    **Content:** `"Un login doit être fourni"`

**S'identifier par token**
----
    Permet de s'identifier à partir d'un token stocké dans les cookies
* **URL**

    /api/authentication

* **Method:**
    `GET`
  
* **URL Params**

* **Query Params**

* **Data Params**

* **Success Response:**
  

  * **Code:** 200 
    **Content:** `{id : [String], login : [String], email : [String]} `
 
* **Error Response:**

  * **Code:** 403 
    **Content:** `"Mot de passe incorrect"`

**Se connecter par login et mot de passe**
----

* **URL**

    /api/authenticate

* **Method:**
    `PUT`
  
* **URL Params**

* **Query Params**

* **Data Params**

    `login=[String]`
    `password=[String]`

   **Optional:**
 
    `login=[String]`
    `password=[String]`


* **Success Response:**
  

  * **Code:** 200 
    **Content:** `{id : [String], login : [String], email :[String]} `
 
* **Error Response:**

 * **Code:** 403 
    **Content:** `"Login ou mot de passe incorrect"`

**Se déconnecter**
----

* **URL**

    /api/authenticate

* **Method:**
    `DELETE`
  
* **URL Params**

* **Query Params**

* **Data Params**

* **Success Response:**
  

  * **Code:** 204 
    **Content:** ` `
 
* **Error Response:**

  * **Code:** 401 
    **Content:** `""`

**Créer une partie**
----
* **URL**

    /api/game

* **Method:**
    `POST`
  
* **URL Params**

* **Query Params**

* **Data Params**

    `name=[String]`
    `public=[Boolean]`
    `nbPile=[Integer]`

   **Optional:**
 
    `name=[String]`
    `public=[Boolean]`
    `nbPile=[Integer]`


* **Success Response:**
  

  * **Code:** 201 
    **Content:** ` {id:[String]} `
 
* **Error Response:**

  * **Code:** 500 
    **Content:** `""`

**Récupérer les actions**
----
    Permet de récupérer les actions manquées depuis le dernier rafraichissement.
    Le query Param version permet de récupérer en plus de l'état de la partie actuel les dernières actions ayant mené à cet état depuis version.
* **URL**

    /api/game/:id/actions

* **Method:**
    `GET`
  
* **URL Params**
    `id=[String]`

    **Required**
    `id=[String]`

* **Query Params**
    `version=[Integer]`
    **Optional**
    `version=[Integer]`

* **Data Params**


* **Success Response:**
  

  * **Code:** 200 
    **Content:** `Objet contenant toutes les informations sur la partie `
 
* **Error Response:**

  * **Code:** 412 
    **Content:** `erreur=[String]`

    OR
 * **Code:** 403 
    **Content:** `""`

**Passer son tour**
----
* **URL**

    /api/game/:id/tour

* **Method:**
    `PUT`
  
* **URL Params**
    `id=[String]`

    **Required**
    `id=[String]`

* **Query Params**


* **Data Params**


* **Success Response:**
  

  * **Code:** 200 
    **Content:** ` `
 
* **Error Response:**

  * **Code:** 412 
    **Content:** `erreur=[String]`

    OR
 * **Code:** 403 
    **Content:** `""`

**Jouer une carte**
----
    Permet de jouer une carte sur une pile.
* **URL**

    /api/game/:id/card

* **Method:**
    `PUT`
  
* **URL Params**
    `id=[String]`

    **Required**
    `id=[String]`

* **Query Params** 

* **Data Params**
`cardValue=[Integer]`
    `pileId=[String]`
    **Required**
    `cardValue=[Integer]`
    `pileId=[String]`

* **Success Response:**
  

  * **Code:** 200 
    **Content:** ` {} `
 
* **Error Response:**

  * **Code:** 412 
    **Content:** `erreur=[String]`

    OR
 * **Code:** 403 
    **Content:** `""`