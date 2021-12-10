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
app.use('/api/producto', require('./routes/producto'));
app.use('/api/transporte', require('./routes/transporte'));
app.use('/api/pedido', require('./routes/pedido'));
app.use('/api/pagos', require('./routes/pagos'));
app.use('/api/contrato', require('./routes/contrato'));
app.use('/api/subasta', require('./routes/subasta'));
app.use('/api/datosFk', require('./routes/datosFk'));
app.use('/api/ventaLocal', require('./routes/ventaLocal'));
app.use('/api/reporte', require('./routes/reporte'));

//port
const port = process.env.PORT;

//listen.port

app.listen(port, () => {
    console.log(`Aplicacion de Oracle corriendo en el puerto ${port}`);
})