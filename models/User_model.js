const mongoose = require("mongoose"),
  variable = require("./../helper/validation/variable"),
  max_length = variable.max_length;

const schema = new mongoose.Schema({
  first_name: { type: String, required: true, maxlength: max_length.medium },
  last_name: { type: String,  maxlength: max_length.medium },
  email: { type: String, required: true, maxlength: max_length.medium },
  password: { type: String, required: true, maxlength: max_length.medium },
  phone: { type: String,  maxlength: max_length.specific.phone },
  // address: { type: String, required: true, maxlength: max_length.long },
  // country: { type: String, required: true, maxlength: max_length.short },
  // state: { type: String, required: true, maxlength: max_length.short },
  // city: { type: String, required: true, maxlength: max_length.short },
  // zipcode: {
  //   type: String,
  //   required: true,
  //   maxlength: max_length.specific.zipcode,
  // },
  profile_image: { type: String, maxlength: max_length.medium, required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "roles" },
  type: { type: String, default: "user" },
  fcm_token: [{ type: String }],
  created_at: { type: Date, default: Date.now },
  // created_by: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   refPath: "created_by_model",
  // },
  // created_by_model: {
  //   type: String,
  //   required: true,
  //   enum: ["admins", "users"], //Possible model names like admins, users for populate
  // },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
  updated_by: { type: mongoose.Schema.Types.ObjectId },
  deleted_at: { type: Date },
  deleted_by: { type: mongoose.Schema.Types.ObjectId },
  deleted: { type: Boolean, default: false },
  status: { type: String, default: "active" }, //active, inactive
  // changed: { type: Boolean, default: false }, // not required coz access-token expires every 15 mins
});

module.exports = mongoose.model("users", schema, "users");
