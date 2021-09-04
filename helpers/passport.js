const  passport  =  require('passport');
const  {Strategy , ExtractJwt }  =  require('passport-jwt');
const fs = require('fs');
const path = require('path');
const SEC_KEY = fs.readFileSync(path.join(__dirname, '..', 'key.txt'));
const Users=require('mongoose').model('Users');

const passportOptions={
    jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:SEC_KEY
}

const strategy= new Strategy(passportOptions,(payload,done)=>{

    //payload will have uid and uname, which were included while issuing JWT token
    Users.findOne({_id:payload.uid,username:payload.uname})
        .then((user)=>{
            if(user)
            {
                 return done(null,user)
            }
            else{
                return done(null,false)
            }
        })
        .catch(err=>{
            return done(err,null);
        })
})

passport.use(strategy);

module.exports=passport;
