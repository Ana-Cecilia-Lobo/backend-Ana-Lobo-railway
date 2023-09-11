import { configuracion } from "../config/config.js";
import jwt  from "jsonwebtoken";
import nodemailer from "nodemailer";

export const generateEmailToken = (email, expireTime)=>{
    const token = jwt.sign({email}, configuracion.server.secretToken, {expiresIn: expireTime});
    return token;
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth:{
        user: configuracion.gmail.adminEmail,
        pass: configuracion.gmail.adminPass
    },
    secure: false,
    tls:{
        rejectUnauthorized: false
    }
});

export const sendRecoveryEmail = async(userEmail,token)=>{

    const link = `http://localhost:8080/reset-password?token=${token}`;

    await transporter.sendMail({

        from:"E-commerce Ana",
        to: userEmail,
        subject:"Restablecer contraseña",
        html:`
            <div>
                <h2>Hola, estas restableciendo tu contraseña</h2>
                <p>Da clic para restablecer tu contraseña</p>
                <a href="${link}">
                    <button>Restablecer mi contraseña</button>
                </a>
            </div>
        `
    })
}

export const sendInactivityEmail = async(userEmail)=>{

    await transporter.sendMail({

        from:"E-commerce Ana",
        to: userEmail,
        subject:"Su cuenta ha sido eliminada por inactividad",
        html:`
            <div>
                <p>Hola, lamentamos informarle que su cuenta ha sido eliminada por inactividad</p>
            </div>
        `
    })
}

export const sendDeletedProductEmail = async(userEmail)=>{
    await transporter.sendMail({

        from:"E-commerce Ana",
        to: userEmail,
        subject:"Un producto que le pertenece, ha sido eliminado",
        html:`
            <div>
                <p>Hola, le informamos que un producto que le pertenece, ha sido eliminado</p>
            </div>
        `
    })
}