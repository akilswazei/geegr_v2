const mongoose = require("mongoose"),
  variable = require("./../helper/validation/variable"),
  min_length = variable.min_length,
  max_length = variable.max_length;

const schema = new mongoose.Schema({

  proposal_id: { type: String, required: true, maxlength: max_length.medium },
  message: { type: String, maxlength: max_length.long },
  from:  {
        type: String,
        enum : ['customer','vendor','system']
    },
  type:   {
        type: String,
        enum : ['proposal','message','file','add_line_items','release_payment','project_complete','proposal_update','system']
    },
  data:   { 
    file: { type: String,default:""},
    budget: { type: Number,default:0}, 
    description: { type: String,default:""},
    status: { type: String,default:""},
    line_items:[
    {
        line_item_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "proposals",
          required: true 
        },
        title: { type: String,default:""},
        description: { type: String,default:""},
        budget: { type: Number,default:0},
        status:  { type: String,default:""}

      }
    ]
  },
  created_at: { type: Date, default: Date.now },
  update:{ type: Boolean,default:false},
 

})

  module.exports = mongoose.model("chats", schema, "chats");

