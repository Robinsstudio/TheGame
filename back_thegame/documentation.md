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
  

  * **Code:** 201 <br />
    **Content:** ` `
 
* **Error Response:**

  <_Most endpoints will have many ways they can fail. From unauthorized access, to wrongful parameters etc. All of those should be liste d here. It might seem repetitive, but it helps prevent assumptions from being made where they should be._>

  * **Code:** 409 <br />
    **Content:** `"Pseudo déjà utilisé"`

* **Sample Call:**

  <_Just a sample call to your endpoint in a runnable format ($.ajax call or a curl request) - this makes life easier and more predictable._> 

* **Notes:**

  <_This is where all uncertainties, commentary, discussion etc. can go. I recommend timestamping and identifying oneself when leaving comments here._> 



  
