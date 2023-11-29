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

async function add(req,res,next){

    console.log("Wallet add method called");

    //const walletId = generateUniqueNumber();
    const walletId = await generateUniqueNumber();

    let returnJson = { success: false };
    const allheaders=req.headers;
    
    const data= req.body;
    
    const decoded = await jwt.verify(allheaders['token'],'shhhhh');

    console.log("Wallet Id" + walletId);


    const initialBalance = data.balance;
    const mini_trans_amt_per = process.env.MIN_TRANS_AMOUNT_PERCENT;
    let minimum_percent_amount = percentage(initialBalance, mini_trans_amt_per);

    try{

        const result = await Wallet.findOneAndUpdate(
           { user_id: decoded.user._id },
           { user_id: decoded.user._id, description: data.description, balance: initialBalance, minimum_transaction_balance: minimum_percent_amount, wallet_id: walletId },
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

function percentage(partialValue, totalValue) {
   return (totalValue * partialValue) / 100;
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

async function generateUniqueNumber() {
  // Get the current timestamp
  const timestamp = Date.now();

  // Generate a random number between 10000 and 99999
  const random = Math.floor(Math.random() * 90000) + 10000;

  // Combine timestamp and random number to create a 10-digit unique number
  const uniqueNumber = `${timestamp}${random}`.slice(0, 10);

  let resultWallet = await Wallet.findOne({ wallet_id: uniqueNumber });

  // Check if resultWallet is empty or not found
  if (!resultWallet) {
    return uniqueNumber;
  } else {
    // Return the result of the recursive call
    return generateUniqueNumber();
  }
}



module.exports={index,add,transaction}