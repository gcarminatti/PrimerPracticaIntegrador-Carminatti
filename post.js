const axios = require("axios");

const data = {
  title: "Producto Mongo",
  description: "Descripción del Producto Mongo 1",
  price: 12,
};

axios
  .post("http://localhost:8080/addProduct", data)
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(error);
  });
