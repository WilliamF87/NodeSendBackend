import Usuario from "../models/Usuario.js"
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";

const nuevoUsuario = async (req, res) => {

    // Mostrar mensajes de error de express-validator
    const errores = validationResult(req);

    if(!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()});
    }

    // Verificar que el usuario no exista
    const { email, password } = req.body;

    let usuario = await Usuario.findOne({ email });

    if(usuario) {
        return res.status(400).json({msg: 'El usuario ya está registrado'});
    }
   
    // Crear un nuevo usuario

    usuario = new Usuario(req.body);

    // Hashear el password
    const salt = await bcrypt.genSalt(10); // Entre más vueltas mejor será el hasheo, pero consumira más recursos. 10 es una buena opción
    usuario.password = await bcrypt.hash(password, salt);

    try {
        await usuario.save();
        return res.json({msg: 'Usuario creado correctamente'});
    } catch (error) {
        console.log(error);
    }
}

export {
    nuevoUsuario
}