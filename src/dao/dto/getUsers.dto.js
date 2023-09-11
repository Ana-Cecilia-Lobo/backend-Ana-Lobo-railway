export class getUsersDto{
    constructor(user){
        this.nombreCompleto = `${user.first_name} ${user.last_name}`,
        this.email= user.email,
        this.rol = user.rol
    }
}