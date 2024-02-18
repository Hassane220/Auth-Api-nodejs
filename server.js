const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const dbConfig = require("./app/config/db.config");  // Import de la configuration


const app = express();


var corsOptions = {
  origin: "http://localhost:8085"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "bezkoder-session",
    keys: ["COOKIE_SECRET"],
    httpOnly: true
  })
);

// Connexion à MongoDB
const db = require("./app/models");
const Role = db.role;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
  })
  .then(() => {
    console.log("Successfully connect to MongoDB!!!");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

  function initial() {
    Role.estimatedDocumentCount()
      .then(count => {
        if (count === 0) {
          new Role({
            name: "user"
          }).save()
            .then(() => {
              console.log("added 'user' to roles collection");
            })
            .catch(err => {
              console.log("error", err);
            });
  
          new Role({
            name: "moderator"
          }).save()
            .then(() => {
              console.log("added 'moderator' to roles collection");
            })
            .catch(err => {
              console.log("error", err);
            });
  
          new Role({
            name: "admin"
          }).save()
            .then(() => {
              console.log("added 'admin' to roles collection");
            })
            .catch(err => {
              console.log("error", err);
            });
        }
      })
      .catch(err => {
        console.error("Error getting document count:", err);
      });
  }

  // routes
  require('./app/routes/auth.routes')(app);
  require('./app/routes/user.routes')(app);

  
  // set port, listen for requests
  const PORT = process.env.PORT || 8086;
  app.listen(PORT,'0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}.`);
  });