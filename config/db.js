import mongoose from "mongoose";
import dotenv from "dotenv";

// require('dotenv').config({ path: 'variables.env' }); sin imports
dotenv.config({ path: 'variables.env' });

const user = process.env.USER;
const password = process.env.PASSWORD;
const db = process.env.DB;

const conectarDB = async () => {

    try {
        await mongoose.connect(
            `mongodb+srv://${user}:${password}@cluster0.huenyqh.mongodb.net/${db}`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        )
        console.log("DB conectada");
    } catch (error) {
        console.log("Hubo un error");
        console.log(error);
        process.exit(1); // Detener el servidor: 0 es un código de éxito y 1 un código de error
    }
}

export default conectarDB;