# Documentation de l'API RESTful du projet The Game
L'API est composée d'un ensemble de routes matérialisant des ressources et associées à des verbes HTTP. Le corps des requêtes est en JSON.

**Utilité de l'API**
----
L'objectif de cette API est de permettre aux utilisateurs d'avoir toutes les fonctions nécessaires à la gestion d'une partie du célèbre jeu de société nommé TheGame. Ainsi grâce à cette API vous pourrez créer, sauvegarder et jouer au jeu tout en laissant l'API contrôler vos actions. Celle-ci vous fournira donc toutes les routes nécessaires pour vous permettre de mettre en place un système de lobby à partir duquel le joueur pourra choisir de continuer une partie en cours ou d'en débuter une nouvelle.
Cette API utilise principalement les modules nodes express et mongoose. Afin de sauvegarder les parties, il est nécessaire d'avoir au préalable un serveur mongoDb lancé auquel l'application pourra accéder.


**Liste des routes utilisables de l'API**
----
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
api/game/:id/message| ✗   | ✗   | ✓   | ✗
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
  * **Code:** 401 
    **Content:** `""`

**Supprimer son compte**
----
* **URL**
    /api/account

* **Method:**
    `DELETE`

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

* **Success Response:**
  * **Code:** 200 
    **Content:** `{
        players : [{ 
                _id : [String], 
                ready : [Boolean], 
                hand : [{_id :[String], value : [Integer]}] 
            }],
        nowPlaying : [String] (L'id du joueur dont c'est le tour),
        status : [String] (Le statut de la partie),
        deckPile : [Integer] (Le nombre de cartes restantes dans le deck),
        version : [Integer] (La version de la partie),
        message : [{
                who:[String],
                message:[String]
            }] (Liste des messages non lus par le joueur),
        actions : [{
                _id:[String],
                type:[String],
                details:{who:[String],card:[Object]}
            }] (Liste des actions manquées par le joueur),
        piles : [ {
                _id : [String],
                cards:[Object],
                orientation:[String]
            }]
     } `
 
* **Error Response:**
  * **Code:** 412 
    **Content:** `erreur=[String]`
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

* **Success Response:**
  * **Code:** 200 
    **Content:** ` `
 
* **Error Response:**
  * **Code:** 412 
    **Content:** `erreur=[String]`
  * **Code:** 403 
    **Content:** `""`

**Savoir ou une carte est jouable**
----
    Retourne une liste contenant les id de piles sur lesquelles la carte choisie peut être posée.
* **URL**
    /api/game/:id/card

* **Method:**
    `GET`
  
* **URL Params**
    `id=[String]`

    **Required**
    `id=[String]`

* **Query Params**
    `cardValue=[Integer]`
    **Required**
    `cardValue=[Integer]`

* **Success Response:**
  * **Code:** 200 
    **Content:** `Objet contenant toutes les informations sur la partie `
 
* **Error Response:**
  * **Code:** 412 
    **Content:** `erreur=[String]`
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
  * **Code:** 403 
    **Content:** `""`

**Passer à prêt dans une partie**
----
    Permet de devenir prêt lorsque la partie est en attente de lancement ou inversement.
* **URL**
    /api/game/:id/ready

* **Method:**
    `PUT`
  
* **URL Params**
    `id=[String]`

    **Required**
    `id=[String]`

* **Success Response:**
  * **Code:** 200 
    **Content:** ` `
 
* **Error Response:**
  * **Code:** 412 
    **Content:** `erreur=[String]`
  * **Code:** 403 
    **Content:** `""`

**Rejoindre une partie**
----
    Permet de rejoindre une partie n'ayant pas commencé et ainsi faire partie des joueurs et non des spectateurs. 
    Retourne les actions de la partie afin de connaître le nombre de joueurs, de piles...
* **URL**

    /api/game/:id/player

* **Method:**
    `PUT`
  
* **URL Params**
    `id=[String]`

    **Required**
    `id=[String]`

* **Success Response:**
  * **Code:** 200 
    **Content:** `Objet contenant toutes les informations sur la partie `
 
* **Error Response:**
  * **Code:** 412 
    **Content:** `erreur=[String]`
  * **Code:** 403 
    **Content:** `""`

**Quitter une partie**
----
    Permet de quitter une partie n'ayant pas encore commencée.
* **URL**

    /api/game/:id/player

* **Method:**
    `DELETE`
  
* **URL Params**
    `id=[String]`

    **Required**
    `id=[String]`

* **Success Response:**
  * **Code:** 200 
    **Content:** `""`
 
* **Error Response:**
    * **Code:** 412 
    **Content:** `erreur=[String]`
    * **Code:** 403 
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

* **Success Response:**
  * **Code:** 200 
    **Content:** `Objet contenant toutes les informations sur la partie `
 
* **Error Response:**
  * **Code:** 412 
    **Content:** `erreur=[String]`
  * **Code:** 403 
    **Content:** `""`

**Envoyer un message**
----
    Permet d'envoyer un message aux autres joueurs présent dans la partie et actuellement connectés.
* **URL**
    /api/game/:id/message

* **Method:**
    `PUT`
  
* **URL Params**
    `id=[String]`

    **Required**
    `id=[String]`

* **Data Params**
    `message=[Integer]`

* **Success Response:**
  * **Code:** 200 
    **Content:** ` `
 
* **Error Response:**
  * **Code:** 412 
    **Content:** `erreur=[String]`
  * **Code:** 403 
    **Content:** `""`

**Récupérer les parties que l'on peut rejoindre en tant que joueur**
----
    Permet de récupérer une liste de parties (id,nom,version,nombre de joueurs...) publiques n'ayant pas encore débutées ou ayant déjà débutées mais pour lesquelles nous sommes joueurs.
* **URL**

    /api/games/playable

* **Method:**
    `GET`

* **Success Response:**
  * **Code:** 200 
    **Content:** `Objet contenant une liste de partie`

* **Error Response:**

  * **Code:** 500 
    **Content:** `erreur=[String]`
  * **Code:** 403 
    **Content:** `""`

**Récupérer les parties jouées et terminées par le joueur**
----
    Permet de récupérer toutes les parties finies pour lesquelles le joueur était présent.
* **URL**

    /api/games/ended

* **Method:**
    `GET`

* **Success Response:** 
  * **Code:** 200 
    **Content:** `Objet contenant toutes les informations sur la partie `
 
* **Error Response:**
  * **Code:** 412 
    **Content:** `erreur=[String]`
  * **Code:** 403 
    **Content:** `""`