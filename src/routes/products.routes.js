const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

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

// Ruta para crear un nuevo producto
router.post("/products", (req, res) => {
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

// Ruta para obtener todos los productos
router.get("/products", (req, res) => {
  Product.find()
    .then((products) => {
      res.status(200).json(products);
    })
    .catch((error) => {
      res.status(500).json({ error: "Error al obtener la lista de productos" });
    });
});

// Ruta para obtener un producto por su ID
router.get("/products/:id", (req, res) => {
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

// Ruta para actualizar un producto
router.put("/products/:id", (req, res) => {
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

// Ruta para eliminar un producto
router.delete("/products/:id", (req, res) => {
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

module.exports = router;
