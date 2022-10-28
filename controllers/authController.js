import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

// dotenv.config({ path: 'variables.env' }); No es necesario acá, ya se hizo en db.js

const autenticarUsuario = async (req, res, next) => {

    // Revisar si hay errores
    const errores = validationResult(req);

    if(!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()});
    }

    // Buscar el usuario para ver si está registrado
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });

    if(!usuario) {
        res.status(401).json({ msg: 'El Usuario no existe' }); // 401: error de autenticación
        return next();
    }
    
    // Verificar el password y autenticar al usuario
    // Comparar password enviado (password) con el que está en DB (usuario.password)
    // compareSync (sincrono) cuando se está usando el async await 
    if(bcrypt.compareSync(password, usuario.password)) {
        // Crear Jwt
        const token = jwt.sign({
            id: usuario._id, // Mongo le agrega un _ al id
            nombre: usuario.nombre,
            email: usuario.email
        }, process.env.CLAVE_SECRETA, {
            expiresIn: '8h'
        });

        res.json({ token });
    } else {
        res.status(401).json({ msg: 'Password incorrecto' });
        return next();
    }
}

const usuarioAutenticado = async (req, res, next) => {
    res.json({usuario: req.usuario});
}

export {
    autenticarUsuario,
    usuarioAutenticado
}