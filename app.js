const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const userModel = require('./Models/user.model');
const postModel = require('./Models/post.model');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());


app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render('index');
});

app.get('/createUser', (req, res) => {
    res.render('user');
});

app.post('/createUser', (req, res) => {
    let { fullName, email, phone, age, password } = req.body;

    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return res.send('Something went wrong');
        } else {
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    return res.send('Something went wrong');
                } else {
                    let newUser = userModel.create({
                        fullName,
                        email,
                        phone,
                        age,
                        password: hash
                    })
                    if (newUser) {
                        res.redirect('/');
                    } else {
                        res.send('Something went wrong');
                    }
                }
            })
        }
    })
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (user) {
        const hashPassword = user.password;
        bcrypt.compare(password, hashPassword, (err, result) => {
            if (result) {
                const token = jwt.sign({ email: user.email }, 'secretKey');
                res.cookie('Token', token);
                res.redirect('/profile');
            } else {
                res.send("Something went wrong");
            }
        });
    } else {
        res.send("Something went wrong");
    }
});

app.get('/profile', isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email }).populate('posts');
    let posts = await postModel.find().populate('postBy');

    res.render('profile', { user, posts });
});

app.post('/uploadPost', isLoggedIn, async (req, res) => {
    let { content } = req.body;

    let user = await userModel.findOne({ email: req.user.email });

    let post = await postModel.create({
        postBy: user._id,
        content
    });
    if (post) {
        await userModel.findByIdAndUpdate(user._id, { $push: { posts: post._id } });
        res.redirect('/profile');
    } else {
        res.send('Something went wrong');
    }
});

app.get('/like/:id', isLoggedIn, async (req, res) => {
    let postId = req.params.id;

    let user = await userModel.findOne({ email: req.user.email });

    let post = await postModel.findOne({ _id: postId });

    if (post) {
        if (post.likes.includes(user._id)) {
            post.likes.pull(user._id);
        } else {
            post.likes.push(user._id);
        }
        await post.save();
        res.redirect('/profile');
    } else {
        res.send('Post not found');
    }
});

app.get('/uploadProfile', isLoggedIn, (req, res) => {
    res.render('uploadProfile');
});

app.post('/uploadProfileImage', isLoggedIn, (req, res) => {
    res.send('Profile image upload functionality to be implemented');
});

app.get('/logout', (req, res) => {
    res.clearCookie('Token');
    res.redirect('/');
});



function isLoggedIn(req, res, next) {
    let token = req.cookies.Token;
    if (token) {
        let data = jwt.verify(token, 'secretKey');
        if (data) {
            req.user = data;
            next();
        }
        else {
            res.redirect("/")
        }
    } else {
        res.redirect("/")
    }
}

app.listen(3000);