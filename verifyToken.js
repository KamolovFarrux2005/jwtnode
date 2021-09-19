const jwt = require('jsonwebtoken');

function verify(req,res,next){
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('royhatdan oting');
    try{
        const verified = jwt.verify(token, process.env.JWTSECRET);
        req.user = verified;
        next()
    }catch(err){
        res.status(400).send('token xato')
    }
}

module.exports = verify;

