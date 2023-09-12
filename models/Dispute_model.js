const mongoose = require("mongoose"),
  variable = require("./../helper/validation/variable"),
  min_length = variable.min_length,
  max_length = variable.max_length;

const schema = new mongoose.Schema({

  proposal_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "proposals",
    required: true 
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users" 
  },
  description: { type: String, required: true },
  from: { type: String, required: true },
  type: { type: String, required: true },
}
)
  module.exports = mongoose.model("disputs", schema, "disputs");
