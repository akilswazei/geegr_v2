const jwt=require('jsonwebtoken')
const User = require("./../../models/User_model");
const bcrypt = require("bcryptjs");
// const {insert_user} = require("./../../functions/core")

const Wallet = require("./../../models/Wallet_model");

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

            let resultWallet = await Wallet.findOne({ user_id: result._id });

            // Check if resultWallet is empty or not found
            if (!resultWallet) {
              resultWallet = {}; // Set it to an empty object or any default value
            } else  {
              resultWallet = resultWallet.toObject();
            }

            result = result.toObject();

            result.wallet = resultWallet;
            
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

    
    const initialBalance = 100;
    const mini_trans_amt_per = process.env.MIN_TRANS_AMOUNT_PERCENT;
    let minimum_percent_amount = percentage(initialBalance, mini_trans_amt_per);
    

    // Example usage    
    const walletId = await generateUniqueNumber();
        
    try{
        let saveData = new User({
          first_name: req.body.first_name,
          email: req.body.email,
          password: await bcrypt.hash(req.body.password, 10),
          type: req.body.type
        });
        const result = await saveData.save();

        /* Add initial entry in wallet start */
        let saveWalletData = new Wallet({
          user_id: result._id,
          description: "Initial Balance",
          balance: initialBalance,
          minimum_transaction_balance: minimum_percent_amount,
          wallet_id: walletId
        });
        const resultWallet = await saveWalletData.save();
        /* Add initial entry in wallet end */

        return res.send({
          data: result,
          status: true,
          error:{}
        });        
    } catch(err){
        next({statusCode: 401, error: err.message}); 
    }
    
}

function percentage(partialValue, totalValue) {
   return (totalValue * partialValue) / 100;
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



module.exports={index,signup,changePassword}

