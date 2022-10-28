import express from "express"
import { check } from "express-validator";
import checkAuth from "../middleware/auth.js";
import {
    nuevoEnlace, obtenerEnlace, tienePassword, todosEnlaces, verificarPassword
} from "../controllers/enlacesController.js";

const router = express.Router();

router.post('/',
    [
        check('nombre', 'Sube un archivo').not().isEmpty(),
        check('nombre_original', 'Sube un archivo').not().isEmpty()
    ],
    checkAuth,
    nuevoEnlace
);

router.get('/',
    todosEnlaces
);

router.get('/:url',
    tienePassword,
    obtenerEnlace
);

router.post('/:url',
    verificarPassword,
    obtenerEnlace
);

export default router;