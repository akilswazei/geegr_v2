const jwt=require('jsonwebtoken')
const User = require("./../../models/User_model");
const bcrypt = require("bcryptjs");
// const {insert_user} = require("./../../functions/core")

async function index(req,res,next){
    result = await User.findOne({ email: req.body.email, deleted: false });
    if(result){
        console.log(result.email)  
        const isPasswordValid = await bcrypt.compare(
          req.body.password,
          result.password
        );
        if(isPasswordValid){
            var token = await jwt.sign({ user: result  }, 'shhhhh');
            
            const data={token: token}
            data.user=result;
            return res.send({
              data: data,
              status: true,
              error:{}
            });              
        } else{
            next({statusCode: 401, error: "email id or password is not correct"});    
        } 
    } else{
        next({statusCode: 401, error: "email id or password is not correct"});
    }
}

async function changePassword(req,res,next){

    let  data=req.body
    let newpassword= Math.random() * 10;
    try{
        let saveData ={
          password: await bcrypt.hash( newpassword, 10),
        };
        const result = await User.findOneAndUpdate({email: data.email},saveData);
        // to send mail
        return res.send({
          data: result,
          status: true,
          error:{}
        }); 
    }  
    catch(err){
        next({statusCode: 401, error: err.message}); 
    }
}

async function signup(req,res,next){

    try{
        let saveData = new User({
          first_name: req.body.first_name,
          email: req.body.email,
          password: await bcrypt.hash(req.body.password, 10),

        });

        const result = await saveData.save();
        return res.send({
          data: result,
          status: true,
          error:{}
        });        
    } catch(err){
        next({statusCode: 401, error: err.message}); 
    }

}

async function validate(req,res,next) {
    const allheaders=req.headers;
    if(allheaders['token']){
        try{
            const decoded = jwt.verify(allheaders['token'],'shhhhh');
            req.user=decoded.user
            console.log(req.path);
            if(req.user!="bar"){
                next({statusCode: 401, error: "User not exist"});        
            } else{
                next();
            }        

        } catch(e){
            next({statusCode: 401, error: "token is not validate"}); 
        }
    } else{
        next({statusCode: 400, error: "access token is required"});
    }

}

module.exports={index,validate,signup}

