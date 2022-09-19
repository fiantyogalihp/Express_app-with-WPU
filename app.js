const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const app = express();
const port = 3000;

const { loadContact, findContact } = require('./utils/contacts')

// * setup ejs
app.set("view engine", "ejs");
// * Third-party middleware
app.use(expressLayouts)

// * Built-in middleware
app.use(express.static('public'))

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
  res.render("about", { layout: 'layouts/main-layout', title: 'Halaman About' });
});

app.get("/contact", (req, res) => {
  const contacts = loadContact();

  res.render("contact", {
    layout: 'layouts/main-layout',
    title: 'Halaman Contacts',
    contacts,
  });
});

app.get("/contact/:name", (req, res) => {
  const { name } = req.params;

  const contact = findContact(name);

  res.render('detail_contact', {
    layout: 'layouts/main-layout',
    title: 'halaman Detail Contact',
    contact,
  });
});

app.use((req, res) => {
  res.send(`<h1>404</h1>`)
})

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
