const express = require('express');
const apiRouter = require('./routes/api');
const bodyParser = require('body-parser');
const cors = require('cors');

//instancia de express en app
const app = express();
app.use(cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods: GET, POST, DELETE, PUT');
    next();
});

// settings
app.set('portdevelopment', process.env.PORT || 3001);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//routes
app.use('/api', apiRouter);

// start sever
app.listen(app.get('portdevelopment'), (error) => {
    if (!error) {
        console.log('Running in development');
        console.log(`Server on port http://localhost:${app.get('portdevelopment')}`);
    } else {
        console.log(error);
    }
});


/*** MQTT ***/
const db = require("../src/models");
const dataController = require("../src/controllers/dataController");
var mqtt = require("mqtt");
var client = mqtt.connect(
  "mqtt://localhost"
);
const mysql = require("mysql");

const connection = mysql.createPool({
    connectionLimit: 500,
    host: "remotemysql.com",
    user: "zSLXLaaJiE",
    password: "6CtyMLlTaX", //el password de ingreso a mysql
    database: "zSLXLaaJiE",
    port: 3306,
  });
  console.log("Conexión MQTT");
  client.on("connect", function () {
    client.subscribe("prueba", function (err) {
      if (err) {
        console.log("error en la subscripcion");
      }
    });
  });
  client.on("message", async function (topic, message) {
      console.log(JSON.parse(message.toString()));
      values = JSON.parse(message.toString());
      console.log(values);
      await dataController.save(values);
  });
  
module.exports = app;