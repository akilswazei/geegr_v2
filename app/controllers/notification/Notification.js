const jwt=require('jsonwebtoken')
const Notification = require("./../../../models/Notification_model");


async function index(req,res,next){
   
    console.log("Notification index method called");
    let data=req.body;

    console.log(data);

    try{         
        const result = await Notification.find({ receiver_user_id: data.user._id});
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

module.exports={index}
