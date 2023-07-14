//Importación de módulos necesarios
const express = require("express");
const { create } = require("express-handlebars");
const http = require("http");
const mongoose = require("mongoose");
const productsRoutes = require("./routes/products.routes"); //Configuramos el uso de archivo de rutas

//Instancia de servidor express con puerto 8080
const app = express();
const port = 8080;

//Configuración de plantillas HandleBars y carpetas de vistas / archivos
const hbs = create({
  extname: ".hbs",
  defaultLayout: "main",
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use("/", productsRoutes);

//Configuración de Socket.IO con eventos
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Conexión a la base de datos MongoDB Atlas especificando la coleccion creada.
const uri =
  "mongodb+srv://gcarminatti:xKWO60ZiUXwGFumw@ecommercecoder.tbzf3xq.mongodb.net/ecommerce?retryWrites=true&w=majority";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(uri, options)
  .then(() => {
    console.log("Conexión exitosa a la base de datos");
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
  });
