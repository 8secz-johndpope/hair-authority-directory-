const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const authRoutes = require("./api/routes/auth.routes");
const jwt = require("express-jwt");
const apiRoutes = require('./api/routes/api.routes'); 
const adminRoutes = require('./api/routes/admin.routes'); 
const morgan = require('morgan')
const zohoRoutes = require('./api/routes/zoho.routes'); 
const cors = require('cors'); 

const whitelist = ['https://hairauthoritydirectory.s3.amazonaws.com', 'https://hairauthoritydirectory.com', 'https://subscriptions.zoho.com', 'https://accounts.zoho.com', 'http://hairauthoritydirectory.s3-website-us-east-1.amazonaws.com']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

const PORT = process.env.PORT || 3000;

const basicAuth = jwt({
  secret: process.env.PRIVATE_KEY
});
const adminAuth = jwt({
  secret: process.env.ADMIN_KEY
})
//express middleware
app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(express.json());
app.use(bodyParser.json());
app.use(cors(corsOptions))

app.use(morgan('dev'))

// app.use(express.static("public"));


app.get('/', (req, res) => {
  res.send('Welcome to my API')
}); 

app.use("/auth", authRoutes);
app.use("/api", apiRoutes);

app.use(basicAuth);
app.use(function(err, req, res, next) {
  if(err.name === 'UnauthorizedError') {
    res.status(err.status).send({message:err.code});
    console.log(err.message);
    return;
  }
next();
});

// app.use(adminAuth)
app.use('/zoho', zohoRoutes); 
app.use('/admin', adminRoutes)



app.listen(PORT, () => {
  console.log("app listening on port ", PORT);
});
