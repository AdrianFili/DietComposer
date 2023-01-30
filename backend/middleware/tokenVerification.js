const jwt = require("jsonwebtoken");

function tokenVerification(req, res, next) {
  let token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    res.status(403).send({ message: "Nie znaleziono tokenu!" });
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decodeduser) => {
      if (err) {
        res.status(401).send({ message: "Niezautoryzowano!" });
      } else {
        req.id = decodeduser;
        next();
      }
    });
  }
}

module.exports = tokenVerification;
