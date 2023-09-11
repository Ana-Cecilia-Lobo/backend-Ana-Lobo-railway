import { ProductsService } from "../repository/products.services.js";

//Middleware session
const checkSession = (req, res, next)=>{
    if(req.user){
        next();
    } else {
        res.send('Debes iniciar sesion para acceder a este recurso <a href="/singup">intente de nuevo</a></div>');
    } 
};

const canAddProducts = (req, res, next)=>{
    const user = req.user.rol;
    console.log(user)
     if(user === "admin" || user === "premium"){
         next()
     }else{
         res.send('No tienes los permisos para continuar esta acción <a href="/">Volver al home</a></div>');
     }
 }

const canUpdateProducts = async(req, res, next)=>{
    const user = req.user._id;
    const rol = req.user.rol
    const productid = req.params.pid;

    const product = await ProductsService.getProductById(productid)
    const owner = JSON.parse(JSON.stringify(product.owner))

    if(owner == user || rol === "admin"){
        next()
    }else{
        res.send('No tienes los permisos para continuar esta acción <a href="/">Volver al home</a></div>');
    }

}

const canChat = (req, res, next)=>{
    const user = req.user.rol;
    if(user === "user"){
        next();
    }else{
        res.send('No tienes los permisos para continuar esta acción <a href="/">Volver al home</a></div>');
    }
}
const ownCart = (req, res, next)=>{
    const user = req.user.rol;
    if(user === "user" || user === "premium" || user === "admin"){
        const Owncart = req.user.cart;
        const cart = req.params.cid;
        if(Owncart == cart || user === "admin"){
            next();
        }else{
            res.send('No tienes los permisos para modificar este carrito <a href="/">Volver al home</a></div>');
        }
    }else{
        res.send('No tienes los permisos para continuar esta acción <a href="/">Volver al home</a></div>');
    }
}

const addOwnProduct = async (req, res, next)=>{

    const user = req.user._id;
    const rol = req.user.rol;
    const productid = req.params.pid;

    const product = await ProductsService.getProductById(productid)
    const owner = JSON.parse(JSON.stringify(product.owner))

    if(user == owner || rol === "admin"){
        res.send('No puedes agregar un producto que te pertenece a tu carrito <a href="/">Volver al home</a></div>');
    }else{
        next()
    }
}

const isAdmin = async (req, res, next)=>{
    const user = req.user.rol;
    if(user === "admin"){
            next();
    }else{
        res.send('No tienes los permisos para continuar esta acción <a href="/">Volver al home</a></div>');
    }
}


export {checkSession, canUpdateProducts, canAddProducts, addOwnProduct, canChat, ownCart, isAdmin}