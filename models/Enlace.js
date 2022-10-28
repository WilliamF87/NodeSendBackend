import mongoose from "mongoose";

const Schema = mongoose.Schema;

const enlaceSchema = new Schema({
    url: {
        type: String,
        require: true
    },
    nombre: {
        type: String,
        require: true
    },
    nombre_original: {
        type: String,
        require: true
    },
    descargas: {
        type: Number,
        default: 1
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        default: null
    },
    password: {
        type: String,
        default: null
    },
    creado: {
        type: Date,
        default: Date.now()
    },

});

const Enlace = mongoose.model("Enlace", enlaceSchema);
export default Enlace;