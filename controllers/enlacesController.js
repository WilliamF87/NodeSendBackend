import shortid from "shortid";
import Enlace from "../models/Enlace.js";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";

const nuevoEnlace = async (req, res, next) => {
    
    // Revisar si hay errores
    const errores = validationResult(req);

    if(!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()});
    }

    const { nombre_original, nombre } = req.body;
    
    // Crear un objeto de enlace
    const enlace = new Enlace();

    enlace.url = shortid.generate();
    enlace.nombre = nombre;
    enlace.nombre_original = nombre_original;

    // Si el usuario está registrado
    if(req.usuario) {
        const { password, descargas } = req.body;

        // Asignar al enlace el número de descargas
        if(descargas) {
            enlace.descargas = descargas;
        }

        // Asignar un password
        if(password) {
            const salt = await bcrypt.genSalt(10);
            enlace.password = await bcrypt.hash(password, salt);
        }

        // Asignar el autor
        enlace.autor = req.usuario.id;
    }

    // Almacenar en la DB
    try {
        await enlace.save();
        res.json({ msg: enlace.url });
        return next();
    } catch (error) {
        console.log(error);
    }

}

const obtenerEnlace = async (req, res, next) => {

    // Verificar si éxiste el enlace
    const { url } = req.params;
    const enlace = await Enlace.findOne({ url });
    
    if(!enlace) {
        res.status(404).json({ msg: 'Este enlace no éxiste'});
        return next();
    }

    // Si el enlace éxiste
    res.json({ archivo: enlace.nombre, password: false });
    // password siempre debe ser false cuando se obtiene el enlace
    // Si el enlace no tiene password este valor es false
    // Pero si el enlace tiene password y se ingresa la contraseña, al obtener el
    // enlace este valor debe venir como false para que se muestre en [enlace].js 

    next();
}

const todosEnlaces = async (req, res) => {
    try {
        // -todos los anlaces (solo su url)
        // Mongo siempre pasa el _id, por eso se quita en el select
        const enlaces = await Enlace.find({}).select('url -_id');
        res.json({enlaces});
    } catch (error) {
        console.log(error);
    }
}

// Retorna si el anlace tiene password o no
const tienePassword = async (req, res, next) => {
    // Verificar si éxiste el enlace
    const { url } = req.params;
    const enlace = await Enlace.findOne({ url });
    
    if(!enlace) {
        return res.status(404).json({ msg: 'Este enlace no éxiste'});
    }

    if(enlace.password) {
        return res.json({ password: true, enlace: enlace.url });
    }

    next();
}

const verificarPassword = async (req, res, next) => {
    const { url } = req.params;
    const { password } = req.body;

    // Consultar por el enlace
    const enlace = await Enlace.findOne({ url });

    // Verificar password
    if(bcrypt.compareSync(password, enlace.password)) {
        next();
    } else {
        return res.status(401).json({ msg: 'Password incorrecto' });
    }
}

export {
    nuevoEnlace,
    obtenerEnlace,
    todosEnlaces,
    tienePassword,
    verificarPassword
}