const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

// * DB connection
require('./utils/db');
const Contact = require('./model/contact');

const app = express();
const port = 3000;

// * setup ejs, flash
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  cookie: { maxAge: 6000 },
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));
app.use(flash());

// * Root path
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
    name: "Fiantyo Galih",
    email: "fiantyogalih@gmail.com",
    mahasiswa,
  })
})

// * About path
app.get("/about", (req, res) => {
  res.render("about", { layout: 'layouts/main-layout', title: 'Halaman About' })
})

// * Contact path
app.get("/contact", async (req, res) => {
  const contacts = await Contact.find();

  res.render("contact", {
    layout: 'layouts/main-layout',
    title: 'Halaman Contacts',
    contacts,
    msg: req.flash('msg'),
  })
})

/* // * Add Contact path
app.get('/contact/add', (req, res) => {
  res.render('add_contact', {
    title: 'Form Tambah Data Contact',
    layout: 'layouts/main-layout',
  })
})

// * Post Contact Data path
app.post('/contact', [
  body('name').custom((value) => {
    const duplicate = checkDuplicate(value);

    if (duplicate) {
      throw new Error('Duplicate Name') // ! this return false, but with custom message
    }

    return true
  }),
  check('email', 'Email not valid!').isEmail(), check('nohp', 'No HP not valid!').isMobilePhone('id-ID')], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('add_contact', {
        title: 'Form Tambah Data Contact',
        layout: 'layouts/main-layout',
        errors: errors.array(),
      })
    } else {

      addContact(req.body);
      req.flash('msg', 'Successfully added contact')
      res.redirect('/contact')
    }
  })

// * Delete Contact Data path
app.get('/contact/delete/:name', (req, res) => {
  const { name } = req.params;

  const contact = findContact(name);

  if (!contact) {
    res.status(404).send('<h1>Contact not found</h1>')
  } else {
    deleteContact(name);
    req.flash('msg', 'Successfully Deleted contact')
    res.redirect('/contact')
  }
})

// * Edit Contact path
app.get('/contact/edit/:name', (req, res) => {
  const { name } = req.params;

  const contact = findContact(name);

  res.render('edit_contact', {
    title: 'Form Ubah Data Contact',
    layout: 'layouts/main-layout',
    contact,
  })
})

// * Post Edit Contact data path
app.post('/contact/update', [
  body('name').custom((value, { req }) => {
    const duplicate = checkDuplicate(value);

    const { oldName } = req.body;

    if (value !== oldName && duplicate) {
      throw new Error('Duplicate Name!'); // ! this return false, but with custom message
    }

    return true
  }),
  check('email', 'Email not valid!').isEmail(), check('nohp', 'No HP not valid!').isMobilePhone('id-ID')], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('edit_contact', {
        title: 'Form Ubah Data Contact',
        layout: 'layouts/main-layout',
        errors: errors.array(),
        contact: req.body,
      })
    } else {

      updateContacts(req.body);
      req.flash('msg', 'Successfully changed contact')
      res.redirect('/contact')
    }
  })

// * Detail Contact path
app.get("/contact/:name", (req, res) => {
  const { name } = req.params;

  const contact = findContact(name);

  res.render('detail_contact', {
    layout: 'layouts/main-layout',
    title: 'halaman Detail Contact',
    contact,
  })
}) */

// * Detail Contact path
app.get("/contact/:name", async (req, res) => {
  const { name } = req.params;

  const contact = await Contact.findOne({ name: name });

  res.render('detail_contact', {
    layout: 'layouts/main-layout',
    title: 'halaman Detail Contact',
    contact,
  })
})

// *  404 Handling path
app.use((req, res) => {
  res.send(`<h1>404</h1>`)
})

// * server-side Express Listen Info 
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`MongoDB Contact App | listening on http://localhost:${port}`);
});
