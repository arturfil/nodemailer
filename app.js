const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const keys = require('./keys');

const app = express();

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
  res.render('contact');
});

app.post('/send', (req, res, next) => {
  console.log(req.body);
  const output = `
    <p>New Job/Carrer Email: </p>
    <h3>Contact Details</h3>
      <p>Name: ${req.body.name}</p>
      <p>Company: ${req.body.company}</p>
      <p>Email: ${req.body.email}</p>
      <p>Phone: ${req.body.phone}</p>

    <h3>Message</h3>
    <p>
      ${req.body.message}
    </p>
  `;

  let nodemailer = require('nodemailer');

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: keys.email,
      pass: keys.secretKey,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let mailOptions = {
    from: keys.email,
    to: keys.email,
    subject: req.body.name + ' Portfolio Page',
    text: 'Request',
    html: output,
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
});

const port = 3000 || process.env.PORT;

app.listen(port, () => {
  console.log('Server started');
});
