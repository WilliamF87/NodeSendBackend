import mongoose from "mongoose";

const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    
    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true, // Convertir en minusculas
        trim: true
    },
    nombre: {
        type: String,
        require: true,
        trim: true
    },
    password: {
        type: String,
        require: true,
        trim: true
    }
});

const Usuario = mongoose.model("Usuario", usuarioSchema);
export default Usuario;