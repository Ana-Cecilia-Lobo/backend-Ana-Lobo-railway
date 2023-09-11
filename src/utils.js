import bcrypt from "bcrypt";
import path from 'path';
import { fileURLToPath } from 'url';
import { Faker, faker, es} from "@faker-js/faker"
import { configuracion } from "./config/config.js";
import jwt from "jsonwebtoken";
import multer from "multer"

const customFaker = new Faker({
    locale:[es]
});

const {commerce, image, string, datatype} = customFaker;

//generar productos
export const generateProduct = ()=>{
    return {
        title:commerce.product(),
        description:commerce.productAdjective(),
        price:commerce.price({ min: 10, max: 999 }),
        code:string.alphanumeric(10),
        status:datatype.boolean(0.5),
        thumbnail:image.urlPicsumPhotos(),
        stock:parseInt(string.numeric(2)),
        category:commerce.department()
        
    }
};


export const __dirname = path.dirname(fileURLToPath(import.meta.url));

//funcion para crear el hash
export const createHash = (password)=>{
    return bcrypt.hashSync(password,bcrypt.genSaltSync());
};

//funcion para comparar las contraseñas
export const isValidPassword = (password, user)=>{
    return bcrypt.compareSync(password,user.password);
};

export const verifyEmailToken = (token)=>{
    try {
        const info = jwt.verify(token,configuracion.server.secretToken);
        return info.email;
    } catch (error) {
        return null;
    }
};


//definir storage de multer
//funcion para validar los campos del registro de un usuario
const checkfields = (user)=>{
    const userr = user
    if(!userr){
        return false;
    } else {
        return true;
    }
};
//funcion para filtrar los datos, antes de guardar la imagen
const multerProfilefilter = (req,file,cb)=>{
    const validFields = checkfields(req.user);
    if(!validFields){
        console.log(validFields)
        cb(null, false);
    } else {
        cb(null, true);
    }
}


//Configurar donde guardar las imagenes del perfil de los usuarios
const profileStorage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.join(__dirname,"/multer/users/images"))
    },
     filename:function(req,file,cb){
        cb(null,`${req.user.email}-perfil-${file.originalname}`) 
    }
});
//crear el uploader
export const uploadProfile = multer({storage:profileStorage, fileFilter:multerProfilefilter});


//configuración de donde guardar los documentos de los usuarios
const userDocsStorage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.join(__dirname,"/multer/users/documents"))

    },
    filename:function(req,file,cb){
        cb(null,`${req.user.email}-documento-${file.originalname}`)

    }
});
//crear el uploader
export const uploadUserDoc = multer({storage:userDocsStorage, fileFilter:multerProfilefilter});



//configuración de donde guardar las imagenes de los productos
const imgProductStorage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.join(__dirname,"/multer/products/images"))
    },
    filename:function(req,file,cb){
        cb(null,`${req.product.code}-imgProducto-${file.originalname}`)
    }

});

//crear el uploader
export const uploadImgProduct = multer({storage:imgProductStorage, fileFilter:multerProfilefilter});