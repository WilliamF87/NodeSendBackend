import multer from "multer";
import shortid from "shortid";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import Enlace from "../models/Enlace.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename + '/../uploads');
// __dirname: ruta del componente | /../uploads: salirse de la carpeta y entrar en uploads

const subirArchivo = async (req, res, next) => {

    const fileStorage = multer.diskStorage({
        // __dirname: directorio actual | mimetype es 'image/jpeg'
        destination: (req, file, cb) => {
            cb(null, __dirname + '/../uploads');
        },
        filename: (req, file, cb) => {
            // const extension = file.mimetype.split('/')[1];
            // cb(null, `${shortid.generate()}.${extension}`);
            const extension = file.originalname
                .substring(file.originalname.lastIndexOf('.'),
                file.originalname.length); // cortar la última parte del nombre original (la extensión)
            cb(null, `${shortid.generate()}${extension}`);
            // con substring la extrensión ya lleva el punto (no es necesario ponerlo como con mimetype) 
        }
        // Ejemplo de como bloquear tipos de archivos (pdf en este caso)
        // fileFilter: (req, file, cd) => {
        //     if(file.mimetype === 'application/pdf') {
        //         return cb(null, true); // true: hay un error
        //     }
        // }
    })
    
    const configMulter = {
        // 1024 * 1024 equivale a 1 mega | cb: callback
        limits: { fileSize: req.usuario ? 1024 * 1024 * 10 : 1024 * 1024 },
        storage: fileStorage
    }
    
    const upload = multer(configMulter).single('archivo');

    upload(req, res, async error => {

        if(!error) {
            res.json({ archivo: req.file.filename });
        } else {
            console.log(error);
            return next();
        }
    });
    
}

const eliminarArchivo = async (req, res) => {

    try {
        // fs: file system (para eliminar archivos)
        // unlink: eliminar archivo verisón sincrona | unlinkSync: verisón asincrona
        fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`);
        // console.log("Archivo eliminado")
    } catch (error) {
        console.log(error);
    }
}

// Descargar un archivo
const descargar = async (req, res, next) => {

    // Obtener el enlace
    const { archivo } = req.params;
    const enlace = await Enlace.findOne({ nombre: archivo });
    
    // Ruta exacta del archivo
    const archivoDescarga = __dirname + '/../uploads/' + archivo;
    res.download(archivoDescarga);
    // res.send: sirve para enviar una vista html

    // Eliminar el archivo y la entrada a la DB
    const { descargas, nombre, _id } = enlace;

    // Si las descargas son iguales a 1: borrar la entrada y el archivo
    if(descargas === 1) {
        // Pasar variable al siguiente controlador (eliminarArchivo) en el req
        req.archivo = nombre;

        // Eliminar la entrada en DB
        // await Enlace.findOneAndRemove(req.params.url); // Error: borraba siempre la primera entrada en DB
        await Enlace.findOneAndDelete(_id);

        // Pasar al middleware eliminarArchivo
        next();
    } else {
        // Si las descargas son mayores a 1: restar 1
        enlace.descargas--;
        await enlace.save();
    }
}

export {
    subirArchivo,
    eliminarArchivo,
    descargar
}