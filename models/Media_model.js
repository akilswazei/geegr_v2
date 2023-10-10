const mongoose = require("mongoose"),
  variable = require("./../helper/validation/variable"),
  min_length = variable.min_length,
  max_length = variable.max_length;

const schema = new mongoose.Schema({

  file: { type: String, required: true },
  type:   {
        type: String,
    },
  created_at: { type: Date, default: Date.now }
})

 module.exports = mongoose.model("media", schema, "media");


