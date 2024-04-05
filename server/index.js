const express=require('express');
const app=express();
const fs = require('fs');
const cors=require('cors')
const users= require('./sample.json')
const PORT = 8000;

app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173",
    methods:["GET","POST","PATCH","DELETE"],
}));

//Display all Users
app.get('/users',(req,res)=>{
    return res.json(users);
});

//post new user
app.post('/users',(req,res)=>{
    const id = Date.now();
    const {name,age,city}=req.body;

    if(!name || !age || !city)
        return res.send({"message":"All Fields are required"});

    users.push({id,name,age,city});
    fs.writeFile('./sample.json',JSON.stringify(users),(err,data)=>{
        return res.json({"message":"User detail added Success"});
     })
});

//Update user
app.patch('/users/:id',(req,res)=>{
    const id = req.params.id;
    const {name,age,city}=req.body;

    if(!name || !age || !city)
        return res.send({"message":"All Fields are required"});

    const index = users.findIndex((user)=>user.id == id);
    users.splice(index,1,{id,...req.body})

    fs.writeFile('./sample.json',JSON.stringify(users),(err,data)=>{
        return res.json({"message":"User detail Updated Success"});
     })
});

//delete user
app.delete('/users/:id',(req,res)=>{
    const id =Number(req.params.id);
    const filteredUsers= users.filter((user)=> user.id !== id)
    // console.log(filtered)
    fs.writeFile('./sample.json',JSON.stringify(filteredUsers),(err,data)=>{
       return res.json(filteredUsers);
    })
});



app.listen(PORT,(err)=>{
    console.log(`App is listening at Port ${PORT}`);
})