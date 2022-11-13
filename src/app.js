require('dotenv').config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const app = express();

require("./db/conn")
const Register = require("./models/registers")

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname,"../public")

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(static_path));
  
// console.log(process.env.SECRET_KEY);
app.get("/",(req,res)=>{
    res.send("index.html")
});

// login check
app.get("/login",(req,res)=>{
    res.redirect("login.html")
})

app.post("/login",async(req,res)=>{
    try {
        const email = req.body.email; 
        const password = req.body.password;

        const useremail= await Register.findOne({email:email});
        
        const isMatch = await bcrypt.compare(password, useremail.password);
        // useremail.password === password

        const token = await useremail.generateAuthToken();
        console.log("the token part in login " + token);

        if(isMatch){
            res.status(201).redirect("/index.html");
        }else{
            res.send("password are not matching");
        }

    } catch (error) {
        res.status(400).send("Invalid Email")
    }
})


//create a new user
app.post("/register", async (req,res) =>{
    try {
        
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if(password === cpassword){

            const registerUser = new Register({
                name : req.body.name,
                email : req.body.email,
                password : password,
                confirmpassword : cpassword
            })

            console.log("the success part " + registerUser);

            const token = await registerUser.generateAuthToken();
            console.log("the token part " + token);

            const registered = await registerUser.save();
            console.log("the page part " + registered);

            res.status(201).redirect("index.html");

        }else{
            res.send("password are not matching");
        }

    } catch (error) {
        res.status(400).send(error)
        console.log("the error part page");
    }
})

// app.post("/register", (req, res) => {
//     try{
//     var name = req.body.name;
//     var email = req.body.email;
//     var password = req.body.password;

//     var data = {
//         "name": name,
//         "email":email,
//         "password": password,
//     }

//     db.collection('registers').insertOne(data, (err, collection) => {
//         if (err) {
//             throw err;
//         }
//         console.log("Record Inserted Successfully");
//     });

//     return res.redirect('index.html');
// }catch(error){
//     res.status(400).send(error);
// }
// })


// Hashing 
// const bcrypt = require("bcryptjs");

// const securePassword = async (password) =>{
//     const passwordHash = await bcrypt.hash(password,10);
//     console.log(passwordHash);

//     const passwordmatch = await bcrypt.compare("thapa@123",passwordHash);
//     console.log(passwordmatch);
// }

// securePassword("thapa@123");


// Create token
// const jwt = require("jsonwebtoken");

// const createToken = async() => {
//     const token = await jwt.sign({_id:"636f4bbffb98dc7e75ef2b30"},"iamvikashmouryafromsuhsiladevicollege",{
//         expiresIn:"2 seconds"
//     })
    
//     console.log(token);

//     const userVer = await jwt.verify(token,"iamvikashmouryafromsuhsiladevicollege");
//     console.log(userVer);
// }

// createToken(); 



app.listen(port,()=>{
    console.log(`server is running at port no ${port}`);
})