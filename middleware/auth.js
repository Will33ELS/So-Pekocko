const jwt = require("jsonwebtoken");
const utils = require("../utils/utils");

//VERIFICATION DE L'AUTHENTIFICATION
module.exports = (req, res, next) => {
  try{
      const token = req.headers.authorization.split(' ')[1]; //RECUPERATION DU TOKEN SITUE DANS L'ENTETE DE LA REQUETE
      const decodedToken = jwt.verify(token, utils.getTokenJWT()); //ON DECODE LE TOKEN
      const userId = decodedToken.userId; //ON RECUPERE LE USER_ID
      if (req.body.userId && req.body.userId !== userId) {
          throw 'Invalid user ID';
      } else {
          next();
      }
  }  catch {
      res.status(401).json({ error: new Error("Invalid request !")});
  }
};
