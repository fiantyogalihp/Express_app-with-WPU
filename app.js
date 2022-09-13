const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.sendFile("./index.html", { root: __dirname });
  // res.send("Hello World!");
});

app.get("/about", (req, res) => {
  res.sendFile("./about.html", { root: __dirname });
  // res.send("ini adalah halaman About!");
});

app.get("/contact", (req, res) => {
  res.sendFile("./contact.html", { root: __dirname });
  // res.send("ini adalah halaman Contactt!");
});

app.get("/product/:id", (req, res) => {
  const { id } = req.params;

  const { category } = req.query;

  res.send(`Product ID: ${id} <br> Category: ${category}`);
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
