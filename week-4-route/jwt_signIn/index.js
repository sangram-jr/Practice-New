const express=require('express');
const jwt=require('jsonwebtoken');
let JWT_SECRET='abcdef';

const app=express();
app.use(express.json());

let arr=[];

app.get('/',(req,res)=>{
    res.send("for testing");
})

app.post('/signup',(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;

    
    arr.push({
        username:username,
        password:password
    });

    res.status(200).json({msg:"singUp successfull"});
    //console.log(arr);
    
})

app.post('/signin',(req,res)=>{

    let username=req.body.username;
    let password=req.body.password;

    /*found the user -->method1 
    let foundUser=null;
    for(let i=0;i<arr.length;i++){
        if(arr[i].username===username && arr[i].password===password){
            foundUser=arr[i];
        }
    }*/
    // method 2
    let foundUser=arr.find((u)=> u.username===username && u.password===password)

    if(foundUser){
        let token=jwt.sign({
        username:username
        },JWT_SECRET);

        //dont store the token because i give the token manually in headers's Athorization field
       // foundUser.token=token;  
        res.status(200).json({token});

    }else{
        res.json({msg:"not found"});
    }

});


//add auth middleware
function auth(req,res,next){

    // in postman i manually give the token in header's Authorization 
    let token=req.headers.token;

    const verifyToken=jwt.verify(token,JWT_SECRET);//we can extract the username form this token because we can create this token using username
    const foundUsername=verifyToken.username;
    if(foundUsername){
        //middleware can change req, 
        // so we set req.username(username form request) = foundUsername. we can easily use this req.username in the /me endpoint to cheak the user.
        req.username=foundUsername;
        next();
    }
    else{
        res.json({msg:"u r not logged in"})
    }
}


app.get('/me',auth,(req,res)=>{
    
    const foundUser=arr.find((u)=>u.username===req.username);

    if(foundUser){
        res.json({
            username:foundUser.username,
            password:foundUser.password
        });
    }
    else{
        res.json({msg:"not found"});
    }
})

app.listen(3000);