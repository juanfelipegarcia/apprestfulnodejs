var express = require('express');
var mysql = require('mysql');
var cors = require('cors');

var app = express();
app.use(express.json());
app.use(cors());

//Se establecen los parametros de la conexion a la BD
var conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'api_restful'
});

conexion.connect(function(error){
    if(error){
        throw error;
    }else{
        console.log("Conexion exitosa a la base de datos");
    }
});

app.get('/', function (req, res) {
    res.send('Ruta de Inicio');
});

//Mostrar los articulos de la tabla producto
app.get('/api/productos', (req, res)=>{
    conexion.query('SELECT * FROM producto', (error, filas)=>{
        if (error) {
            throw error;
        }else{
            res.send(filas);
        }
    })
});

//Mostrar solo un producto
app.get('/api/productos/:id', (req, res)=>{
    conexion.query('SELECT * FROM producto WHERE id = ?', [req.params.id],(error, fila)=>{
        if (error) {
            throw error;
        }else{
            res.send(fila);
        }
    })
});

//Crear producto
app.post('/api/productos', (req, res) => {
    let data = {descripcion:req.body.descripcion, precio:req.body.precio, stock:req.body.stock, familia:req.body.familia};
    let sql = 'INSERT INTO producto SET ?';
    conexion.query(sql, data, function(error, results){
        if (error) {
            throw error;
        }else{
            res.send(results);
        }

    });
});


// Editar Producto
app.put('/api/productos/:id',(req, res)=>{
    let id = req.params.id;
    let descripcion = req.body.descripcion;
    let precio = req.body.precio;
    let stock = req.body.stock; 
    let familia = req.body.familia;
    let sql = "UPDATE producto SET descripcion = ?, precio = ?, stock = ?, familia = ? WHERE id = ?";
    conexion.query(sql, [descripcion, precio, stock, familia, id], function(error, results){
        if (error) {
            throw error;
        }else{
            res.send(results);
        }

    }); 
});

//Eliminar articulos
app.delete('/api/productos/:id',(req, res)=>{
    conexion.query('DELETE FROM producto WHERE id = ?',[req.params.id],(error, filas)=>{
        if (error) {
            throw error;
        }else{
            res.send(filas);
        }
    });
});

const puerto = process.env.PUERTO || 3000;

app.listen(puerto, function () {
    console.log('Servidor OK en Puerto: ' + puerto);
})