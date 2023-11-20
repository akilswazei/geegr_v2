const jwt=require('jsonwebtoken')
const Wallet = require("./../../../models/Wallet_model");
// const {insert_user} = require("./../../functions/core")

async function index(req,res,next){
   
    console.log("Wallet index method called");
    let data=req.body;

    try{
        const result = await Wallet.findOneAndUpdate({user_id: data.user._id},{new: true});
        return res.send({
            data: result,
            status: true,
            error:{}
        });
    } catch(err){
        next({statusCode: 400, error: err.message});
        return
    }
}

async function add(req,res,next){

     console.log("Wallet add method called");

    let returnJson = { success: false };
    const allheaders=req.headers;
    
    const data= req.body;
    
    const decoded = await jwt.verify(allheaders['token'],'shhhhh');

    console.log("vendor service" + decoded.user._id);

    try{

        const result = await Wallet.findOneAndUpdate(
           { user_id: decoded.user._id },
           { user_id: decoded.user._id, description: data.description, balance: data.balance, wallet_id: data.wallet_id },
           { new: true, upsert: true } // Add upsert: true to insert if not found
        );
        return res.send({
            data: result,
            status: true,
            error:{}
        });
    } catch(err){
        next({statusCode: 400, error: err.message});
        return
    }


}

async function transaction(req,res,next){

     console.log("Wallet add method called");

    let returnJson = { success: false };
    const allheaders=req.headers;
    
    const data= req.body;
    
    const decoded = await jwt.verify(allheaders['token'],'shhhhh');

    console.log("vendor service" + decoded.user._id);

    try{

        const result = await Wallet.findOneAndUpdate(
           { user_id: decoded.user._id },
           { user_id: decoded.user._id, description: data.description, balance: data.balance, wallet_id: data.wallet_id },
           { new: true, upsert: true } // Add upsert: true to insert if not found
        );
        
        return res.send({
            data: result,
            status: true,
            error:{}
        });
    } catch(err){
        next({statusCode: 400, error: err.message});
        return
    }


}


module.exports={index,add,transaction}
