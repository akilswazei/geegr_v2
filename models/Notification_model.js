const mongoose = require("mongoose"),
  variable = require("./../helper/validation/variable"),
  min_length = variable.min_length,
  max_length = variable.max_length;

const schema = new mongoose.Schema({
  type: String,
  message: { type: String, maxlength: max_length.long },
  receiver_user_id: { type: String,default:0},
  sendar_user_id: { type: String,default:0},
  project_id: { type: Number,default:0},
  read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },  
});

module.exports = mongoose.model("notification", schema, "notification");
