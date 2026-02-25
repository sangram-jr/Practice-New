import { WebSocketServer,WebSocket } from "ws";
const wss=new WebSocketServer({port:8080});


interface User{
    socket:WebSocket,
    room:string
}
const totalSocket:User[]=[];

wss.on('connection',(socket)=>{
    
    socket.on('message',(msg:string)=>{
        const parsedMessage=JSON.parse(msg);
        if(parsedMessage.type==="join"){
            totalSocket.push({
                socket,
                room:parsedMessage.payload.roomId
            })
        }
        if(parsedMessage.type==="chat"){
            let currentUserRoom=null;
            //find the current user room
            for(let i=0;i<totalSocket.length;i++){
                if(totalSocket[i]?.socket===socket){
                    currentUserRoom=totalSocket[i]?.room;
                }
            }
            for(let i=0;i<totalSocket.length;i++){
                if(totalSocket[i]?.room===currentUserRoom){
                    totalSocket[i]?.socket.send(parsedMessage.payload.message)
                }
            }

        }
    })
    
})

/*
what user can send

join a room: 
{ 
    "type": "join", 
    "payload": { 
        "roomId": "123" 
    } 
} 
 


send message: 
{ 
    "type": "chat", 
    "payload": { 
        "message": "hi there" 
    } 
} 


What the server can send/User recieves

message: 
{ 
    "type": "chat", 
    "payload": { 
        "message": "hi there" 
    } 
} 

*/
