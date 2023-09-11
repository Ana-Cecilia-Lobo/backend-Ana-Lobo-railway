export class CustomError{
    //genera la estructura standard del error
    static createError({name,cause,message,errorCode}){
        const error = {};
        error.name=name;
        error.cause=cause;
        error.message=message;
        error.code=errorCode;
        console.log("error: ", error);
        throw error;
    }
}