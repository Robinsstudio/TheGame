# Documentation de l'API RESTful du projet The Game
L'API est composée d'un ensemble de routes matérialisant des ressources et associées à des verbes HTTP. Le corps des requêtes est en JSON.

Le tableau suivant énumère les différentes routes de l'API ainsi que les verbes avec lesquels elles sont compatibles.

Route        | GET | POST | PUT | DELETE
-------------|-----|------|-----|-------
register     | ✗   | ✓   | ✗   | ✗
authenticate | ✗   | ✓   | ✗   | ✗

Lorsqu'un joueur s'authentifie, un jeton unique est généré sous la forme d'un JSON Web Token (JWT). Ce token doit être stocké dans un cookie pour s'authentifier auprès des requêtes qui le nécessitent. Les propriétés du token sont listées dans le tableau suivant.

Propriété| Description              | Type de données |
---------|--------------------------|-----------------|
idPlayer | id du joueur authentifié | String          |