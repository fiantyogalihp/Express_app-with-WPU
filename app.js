const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const { body, validationResult, check } = require('express-validator');
const methodOverride = require('method-override');

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
app.use(methodOverride('_method'));

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


// * Add Contact path
app.get('/contact/add', (req, res) => {
  res.render('add_contact', {
    title: 'Form Tambah Data Contact',
    layout: 'layouts/main-layout',
  })
})

// * Post Contact Data path
app.post('/contact', [
  body('name').custom(async (value) => {
    const duplicate = await Contact.findOne({ name: value });
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

      Contact.insertMany(req.body, (error, result) => {
        req.flash('msg', 'Successfully added contact')
        res.redirect('/contact')
      });
    }
  })

// * delete contact
app.delete('/contact', (req, res) => {
  Contact.deleteOne({ _id: req.body._id }).then((result) => {
    req.flash('msg', 'Successfully Deleted contact')
    res.redirect('/contact')
  })

})

// * Edit Contact path
app.get('/contact/edit/:name', async (req, res) => {
  const { name } = req.params;

  const contact = await Contact.findOne({ name: name });

  res.render('edit_contact', {
    title: 'Form Ubah Data Contact',
    layout: 'layouts/main-layout',
    contact,
  })
})

// * Post Edit Contact data path
app.put('/contact', [
  body('name').custom(async (value, { req }) => {
    const duplicate = await Contact.findOne({ name: value });

    const { oldName } = req.body;

    if (value !== oldName && duplicate) {
      throw new Error('Duplicate Name!'); // ! this return false, but with custom message
    }

    return true;
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

      Contact.updateOne(
        { _id: req.body._id },
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            nohp: req.body.nohp,
          }
        }).then((result) => {
          req.flash('msg', 'Successfully changed contact')
          res.redirect('/contact')
        });
    }
  })

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
