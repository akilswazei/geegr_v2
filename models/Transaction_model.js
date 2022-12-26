const mongoose = require("mongoose"),
  variable = require("./../helper/validation/variable"),
  min_length = variable.min_length,
  max_length = variable.max_length;

const schema = new mongoose.Schema({

  type: { type: String, required: true, maxlength: max_length.medium },
  description: { type: String, maxlength: max_length.long },
  credit: { type: Number, maxlength: max_length.long },
  debit: { type: Number, maxlength: max_length.long },
  ref: { type: String, maxlength: max_length.long },
  user_id: { type: String, maxlength: max_length.long },
  created_at: { type: Date, default: Date.now },

});

module.exports = mongoose.model("transactions", schema, "transactions");
