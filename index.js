const express = require('express');
const app = express();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const verify = require('./verifyToken')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./model/user');
mongoose.connect('mongodb://localhost/users', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true
}).then(()=> console.log('mongodb'))
  .catch((err)=>console.log(err))  

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static( 'public'))
app.set('view engine', 'ejs')
app.set('views', 'views')

app.get('/home' , verify,(req , res)=>{
   res.send('home')
})
app.get('/register', (req,res)=>{
    res.render('register')
})
app.post('/register' , async(req , res)=>{
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const schema = Joi.object().keys({
        name: Joi.string().min(3).required(),
        email: Joi.string().min(7).email().required(),
        password: Joi.string().min(5).required()
      });
     const {error} = schema.validate(req.body);
      if(error) return console.log(error.message)
   
      const emailValidate = await User.findOne({email: req.body.email})
        if(emailValidate) return res.status(400).send('bunday foydalanuvchi mavjud');
        
        const salt = await bcrypt.genSalt(10);
        const passwordHashing = await bcrypt.hash(password,salt)
        const user = new User({
            name: name,
            email: email,
            password: passwordHashing
         });

    await user.save()

     res.redirect('/login');
    
});
app.get('/login', (req,res)=>{
    res.render('login');
})
app.post('/login', async(req,res)=>{
    const schema = Joi.object().keys({
        name: Joi.string().min(3).required(),
        email: Joi.string().min(7).email().required(),
        password: Joi.string().min(5).required()
      });
     const {error} = schema.validate(req.body);
      if(error) return console.log(error.message)
   
      const userValid = await User.findOne({email: req.body.email})
        if(!userValid) return res.status(400).send('bunday foydalanuvchi mavjud emas !');
       
      const validpass = await bcrypt.compare(req.body.password, userValid.password)
      if(!validpass) return res.status(400).send('Email yoki Parol xato!');
      const token = jwt.sign({id: userValid._id}, '$secretkey');
      res.header('auth-token', token);
})

app.listen(3000, () => {
    console.log(`Server started on port`);
});