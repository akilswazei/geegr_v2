const mongoose = require("mongoose"),
  variable = require("./../helper/validation/variable"),
  min_length = variable.min_length,
  max_length = variable.max_length;


const employeeSchema = new mongoose.Schema({
  ein: { type: String, required: true, maxlength: max_length.medium },
  role: { type: String,  maxlength: max_length.medium },
  username: { type: String, required: true, maxlength: max_length.medium, unique: true },
  name: { type: String, required: true, maxlength: max_length.medium},
  email: { type: String, required: true, maxlength: max_length.medium, unique: true },
  password: { type: String, required: true, maxlength: max_length.medium },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
  status: { type: String, default: "active" }, //active, inactive
  deleted: { type: Boolean, default: false },
  // changed: { type: Boolean, default: false }, // not required coz access-token expires every 15 mins
});

module.exports = mongoose.model("emmployees", employeeSchema, "emmployees");
