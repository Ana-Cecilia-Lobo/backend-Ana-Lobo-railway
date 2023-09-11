const socketClient = io();

const chatEmail = document.getElementById("chatEmail");
const chatInput = document.getElementById("chatInput");
const sendMessage = document.getElementById("sendMessage");
const msgContainer = document.getElementById("msgContainer");

sendMessage.addEventListener("click",()=>{
    const email = chatEmail.value;
    const validEmail= /^\w+([.-_+]?\w+)@\w+([.-]?\w+)(\.\w{2,10})+$/;
    if(validEmail.test(email)){

        socketClient.emit("message",{
            user: email,
            message:chatInput.value
        });
        chatInput.value = "";
    }else{
        alert("Email inválido")
    }
    
});

socketClient.on("msgHistory",(data)=>{
    msgContainer.innerHTML = "";
    data.forEach(element => {
        const parrafo = document.createElement("p");
        parrafo.innerHTML = `user: ${element.user} >> message: ${element.message}`;
        msgContainer.appendChild(parrafo);
    });
});