const express =  require("express")
const morgan = require("morgan");
const cors = require ("cors")
const bodyParser= require("body-parser");

const app = express();

//middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
require('dotenv').config();

//routes
app.use('/api/auth', require('./routes/auth'));

//port
const port = process.env.PORT;

//listen.port

app.listen(port, () => {
    console.log(`Aplicacion de MySQL corriendo en el puerto ${port}`);
})