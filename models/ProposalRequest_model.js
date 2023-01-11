const mongoose = require("mongoose"),
  variable = require("./../helper/validation/variable"),
  min_length = variable.min_length,
  max_length = variable.max_length;

const schema = new mongoose.Schema({

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "projects",
    required: true 
  },
  service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "services",
      required: true 
    },
  created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true 
    },        
  created_at: { type: Date, default: Date.now },
})
module.exports = mongoose.model("proposal_request", schema, "proposal_request");
