const jwt=require('jsonwebtoken')
const Wallet = require("./../../../models/Wallet_model");

const Transaction = require("./../../../models/Transaction_model");
// const {insert_user} = require("./../../functions/core")




async function dashboard(req,res,next){
    console.log("Wallet dashboard ");
    let data=req.body;
}

async function index(req,res,next){
   
    console.log("Wallet index method called");
    let data=req.body;

    try{
         const result = await Wallet.findOneAndUpdate({user_id: data.user._id},{new: true});
        
        let resultTrans = await Transaction.find({ user_id: data.user._id, type: "new_line_item_deposit", amount: { $exists: true } });

        // Check if resultTrans is empty or not found
        let resultTransObj;
        if (!resultTrans) {
            resultTransObj = {}; // Set it to an empty object or any default value
        } else {
            resultTransObj = resultTrans.map(trans => trans.toObject());
        }

        let updatedResult;

        if (result) {
            updatedResult = result.toObject();
        } else {
            // Handle the case when no document is found, e.g., set updatedResult to an empty object
            updatedResult = {};
        }

        updatedResult.wallet_transaction = resultTransObj;

        return res.send({
            data: updatedResult,
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



module.exports={index,add,transaction,dashboard}
