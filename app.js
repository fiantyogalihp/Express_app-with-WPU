const express = require("express");
const expressLayouts = require('express-ejs-layouts')
const app = express();
const port = 3000;

// * setup ejs
app.set("view engine", "ejs");
app.use(expressLayouts)


app.get("/", (req, res) => {
  const mahasiswa = [
    {
      name: "fiantyogalihp",
      fetish: "nun",
    },
    {
      name: "zakie irawan",
      fetish: "oneesan",
    },
    {
      name: "gilang rezaa",
      fetish: "loli",
    },
  ];

  res.render("index", {
    layout: 'layouts/main-layout',
    title: 'halaman Home',
    nama: "Fiantyo Galih",
    email: "fiantyogalih@gmail.com",
    mahasiswa,
  });
});

app.get("/about", (req, res) => {
  res.render("about", { layout: 'layouts/main-layout', title: 'halaman About' });
});

app.get("/contact", (req, res) => {
  res.render("contact", { layout: 'layouts/main-layout', title: 'halaman About' });
});

app.get("/product/:id", (req, res) => {
  const { id } = req.params;

  const { category } = req.query;

  res.send(`Product ID: ${id} <br> Category: ${category}`);
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
