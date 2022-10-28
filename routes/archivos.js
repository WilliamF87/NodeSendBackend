import express from "express";
import checkAuth from "../middleware/auth.js";
import { subirArchivo, descargar, eliminarArchivo } from "../controllers/archivosController.js";

const router = express.Router();

router.post('/',
    checkAuth,
    subirArchivo
);

router.get('/:archivo',
    descargar,
    eliminarArchivo
);

export default router;

// con multipart express-validator