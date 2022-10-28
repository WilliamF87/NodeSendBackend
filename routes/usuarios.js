import expres from "express";
import { nuevoUsuario } from "../controllers/usuarioController.js";
import { check } from "express-validator";

const router = expres.Router();

router.post('/',
    [
        check('nombre', 'El Nombre es obligatorio').not().isEmpty(), // Revisa que nombre no esté vacío
        check('email', 'Agrega un email válido').isEmail(), // Revisa el formato del email
        check('password', 'El Password debe ser de al menos 6 caracteres').isLength(6),
    ],
    nuevoUsuario
);

export default router;