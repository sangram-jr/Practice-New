import { useEffect, useRef, useState } from "react"


function App() {
  
  const[msg,setMsg]=useState(['hello from server']);
  const [roomId,setRoomId]=useState("");
  const[joined,setJoined]=useState(false);

  const inputRef=useRef<HTMLInputElement>(null);
  const wsRef=useRef<WebSocket>(null);

  useEffect(()=>{
    const ws=new WebSocket("ws://localhost:8080");
    ws.onmessage=(e)=>{
      setMsg(m=>[...m,e.data])
    }
    wsRef.current=ws;
    //cleanup
    return()=>{
      ws.close();
    }
  },[]);

  function joinRoom(){
    
    wsRef.current?.send(JSON.stringify({
      type:"join",
      payload:{
        roomId:roomId
      }
    }))
    setJoined(true);
  }

  function sendMessage(){
    const message=inputRef.current?.value;
    if(!message){
      return
    }
    wsRef.current?.send(JSON.stringify({
      type:"chat",
      payload:{
        message:message
      }
    }))
    if(inputRef.current){
      inputRef.current.value="";
    }
    
  }

  return (
    <div className="w-screen h-screen bg-black text-white flex flex-col justify-center items-center">
      {
        !joined?(
          <div className="flex flex-col gap-4">
            <input placeholder="Enter Room Id" type="text" value={roomId} onChange={(e)=>{setRoomId(e.target.value)}} className="bg-white text-black p-2"/>
            <button onClick={joinRoom} className="p-2 bg-purple-400 rounded cursor-pointer">join</button>
          </div>
        ):(
          <div className="w-full h-full flex flex-col justify-between">
            <div className="p-4 overflow-y-auto">
              {
                msg.map((data,index)=>(
                  <div key={index} className="m-4">
                    <span className="p-1 rounded bg-white text-black">
                      {data}
                    </span>
                  </div>
                ))
              }
            </div>
            <div className="bg-white flex">
              <input ref={inputRef}  placeholder="Message...." className="text-black flex-1 p-2" />
              <button onClick={sendMessage} className="bg-purple-400 p-2 rounded cursor-pointer">send message</button>
            </div>

          </div>
        )
      }
    </div>
    
  )
}

export default App
