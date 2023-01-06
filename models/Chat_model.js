const mongoose = require("mongoose"),
  variable = require("./../helper/validation/variable"),
  min_length = variable.min_length,
  max_length = variable.max_length;

const schema = new mongoose.Schema({

  proposal_id: { type: String, required: true, maxlength: max_length.medium },
  message: { type: String, maxlength: max_length.long },
  from:  {
        type: String,
        enum : ['customer','vendor']
    },
  type:   {
        type: String,
        enum : ['proposal','message','file','extra_payment_request','release_payment','project_complete']
    },
  data:   { 
    file: { type: String},
    file: { type: String},
    amount: { type: String}, 
    description: { type: String},
    status: { type: String}
  }

})

  module.exports = mongoose.model("chats", schema, "chats");

