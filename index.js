import express from "express";
import conectarDB from "./config/db.js"
import usuario from "./routes/usuarios.js";
import auth from "./routes/auth.js";
import enlaces from "./routes/enlaces.js";
import archivos from "./routes/archivos.js";
import cors from "cors";

// Crear el servidor
const app = express();

// Permitir que la app procese la inofmación de tipo json
app.use(express.json());

// Habilitar carpeta publica
app.use( express.static('uploads') );

// app.use(checkAuth): si se pone acá se va a ejecutar en todas las peticiones

// Conectar a la base de datos
conectarDB();

// Habilitar Cors
// app.use( cors() ); Así permite el acceso a cualquier url
const opcionesCors = {
    origin: process.env.FRONTEND_URL
}

app.use( cors(opcionesCors) );

app.use('/api/usuarios', usuario);
app.use('/api/auth', auth);
app.use('/api/enlaces', enlaces);
app.use('/api/archivos', archivos)

// Puerto de la app
const port = process.env.PORT || 4000; // Puerto asignado en el deploy (process.env.PORT)

// Arrancar la app
app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor está funcionando en el puerto ${port}`);
})