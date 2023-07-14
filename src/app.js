//Importación de módulos necesarios
const express = require("express");
const { create } = require("express-handlebars");
const http = require("http");
const socketIO = require("socket.io");
const fs = require("fs");
const router = express.Router();
const handlebars = require("handlebars");
const mongoose = require("mongoose");

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

//Esquema de conexión de productos Mongoose especificando la coleccion
const productSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    price: Number,
  },
  { collection: "products" }
);

const Product = mongoose.model("Product", productSchema);

//Configuracion de rutas previas para HBS

app.get("/", (req, res) => {
  let home = { title: "Mi nombre es Gianluca" };

  res.render("index", home);
});

app.get("/productsList", (req, res) => {
  const html = template({ products });
  res.send(html);
});

app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", {
    title: "Lista de productos en tiempo real",
    products: products,
  });
});

//Configuración de las rutas CRUD

app.post("/products", (req, res) => {
  const newProduct = req.body;

  const product = new Product(newProduct);
  product
    .save()
    .then(() => {
      res.status(201).json({ message: "Producto creado correctamente" });
    })
    .catch((error) => {
      res.status(500).json({ error: "Error al crear el producto" });
    });
});

app.get("/products", (req, res) => {
  Product.find()
    .then((products) => {
      res.status(200).json(products);
    })
    .catch((error) => {
      res.status(500).json({ error: "Error al obtener la lista de productos" });
    });
});

app.get("/products/:id", (req, res) => {
  const productId = req.params.id;

  Product.findById(productId)
    .then((product) => {
      if (!product) {
        res.status(404).json({ error: "Producto no encontrado" });
      } else {
        res.status(200).json(product);
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Error al obtener el producto" });
    });
});

app.put("/products/:id", (req, res) => {
  const productId = req.params.id;
  const updatedProduct = req.body;

  Product.findByIdAndUpdate(productId, updatedProduct, { new: true })
    .then((product) => {
      if (!product) {
        res.status(404).json({ error: "Producto no encontrado" });
      } else {
        res.status(200).json({ message: "Producto actualizado correctamente" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Error al actualizar el producto" });
    });
});

app.delete("/products/:id", (req, res) => {
  const productId = req.params.id;

  Product.findByIdAndRemove(productId)
    .then((product) => {
      if (!product) {
        res.status(404).json({ error: "Producto no encontrado" });
      } else {
        res.status(200).json({ message: "Producto eliminado correctamente" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Error al eliminar el producto" });
    });
});

//Configuración de Socket.IO con eventos
const server = http.createServer(app);
const io = socketIO(server);

io.on("connection", (socket) => {
  console.log("Usuario conectado");

  socket.on("newProduct", (newProduct) => {
    const product = new Product(newProduct);
    product
      .save()
      .then(() => {
        io.emit("updateProducts");
        console.log("Producto agregado correctamente");
      })
      .catch((error) => {
        console.log("Error al agregar el producto:", error);
      });
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});

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
