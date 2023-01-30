const makeApp = require("./app.js");

const port = process.env.PORT || 5000;

makeApp.listen(port, () => {console.log("Serwer uruchomiony")});