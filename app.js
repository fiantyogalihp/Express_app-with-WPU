const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const app = express();
const port = 3000;

const { loadContacts, findContact, addContact, checkDuplicate } = require('./utils/contacts');
const { body, validationResult, check } = require('express-validator');


// * setup ejs
app.set("view engine", "ejs");

// * Middleware
app.use(expressLayouts) // * Third-party middleware
app.use(express.static('public')) // * Built-in middleware
app.use(express.urlencoded({ extended: true })); // * Built-in urlencoded middleware


app.use(cookieParser()); // * setup cookie parser
app.use(session({
  cookie: { maxAge: 6000 },
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
})); // * setup session
app.use(flash()); // * setup flash


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
  const contacts = loadContacts();

  res.render("contact", {
    layout: 'layouts/main-layout',
    title: 'Halaman Contacts',
    contacts,
    msg: req.flash('msg'),
  });
});

app.get('/contact/add', (req, res) => {
  res.render('add_contact', {
    title: 'Form Tambah Data Contact',
    layout: 'layouts/main-layout',
  });
});

app.post('/contact', [
  body('name').custom((value) => {
    const duplicate = checkDuplicate(value);

    if (duplicate) {
      throw new Error('Duplicate Name') // ! this return false, but with custom message
    }

    return true;
  }),
  check('email', 'Email not valid!').isEmail(), check('nohp', 'No HP not valid!').isMobilePhone('id-ID')], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render('add_contact', {
        title: 'Form Tambah Data Contact',
        layout: 'layouts/main-layout',
        errors: errors.array(),
      });
    } else {

      addContact(req.body);
      req.flash('msg', 'Successfully added contact');
      res.redirect('/contact');
    }
  })

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
