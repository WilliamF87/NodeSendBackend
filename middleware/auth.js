import jwt from "jsonwebtoken";

const checkAuth = (req, res, next) => {
    // Authorization contiene el Bearer Token
    const authHeader = req.get('Authorization');

    // Comporbar si existe un 
    // if(!authHeader) {
    //     return res.status(401).json();
    // }

    // Comporbar si el token es válido
    if(authHeader) {
        // Obtener el token
        const token = authHeader.split(' ')[1]; // Quitar el Bearer
        // const token = req.headers.authorization.split(' ')[1]; Otra forma
        
        // Comprobar el Jwt (debe usar la misma llave usada para firmarlo)
        try {
            const usuario = jwt.verify(token, process.env.CLAVE_SECRETA);
            req.usuario = usuario; // Asignar el usuario al req
            // De esta forma la comunicación con el controlador va a ser más interna
            // y el usuario no lo va a poder manipular de ninguna forma
        } catch (error) {
            console.log(error);
            // return res.status(401).json();
        }
    }

    return next();
}

export default checkAuth;

// middleware: cada línea o cada parte que se va ejecutando del código