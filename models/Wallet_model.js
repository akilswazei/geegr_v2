const mongoose = require("mongoose"),
  variable = require("./../helper/validation/variable"),
  min_length = variable.min_length,
  max_length = variable.max_length;



const schema = new mongoose.Schema({
  wallet_id: { type: String, required: true, maxlength: max_length.medium },
  description: { type: String, maxlength: max_length.long },    
  balance: { type: String, required: true, maxlength: max_length.short },
  minimum_transaction_balance: { type: String, required: true, maxlength: max_length.short },
  user_id: { type: String },
  created_at: { type: Date, default: Date.now },  
  updated_at: { type: Date },
  deleted_at: { type: Date },
  deleted: { type: Boolean, default: false },
});

module.exports = mongoose.model("wallet", schema, "wallet");
