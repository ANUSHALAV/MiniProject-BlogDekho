const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const userModel = require('./Models/user.model');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));


app.set('view engine' , 'ejs');


app.get('/',(req,res)=>{
    res.render('index');
});

app.get('/createUser',(req,res)=>{
    res.render('user');
});

app.post('/createUser',(req, res) => {
    let { fullName, email, phone, age, password } = req.body;

    bcrypt.hash(password, 10, async (err, hash) => {
        let newUser = await userModel.create({
            fullName,
            email,
            phone,
            age,
            password:hash
        });
        if (newUser) {
            res.render('index');
        } else {
            res.send('Something went wrong');
        }
    })
});

app.listen(3000);