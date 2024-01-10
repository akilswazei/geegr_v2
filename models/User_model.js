const mongoose = require("mongoose"),
  variable = require("./../helper/validation/variable"),
  max_length = variable.max_length;

const schema = new mongoose.Schema({
  first_name: { type: String, required: true, maxlength: max_length.medium },
  last_name: { type: String,  maxlength: max_length.medium },
  email: { type: String, required: true, maxlength: max_length.medium, unique: true },
  password: { type: String, required: true, maxlength: max_length.medium },
  phone: { type: String,  maxlength: max_length.specific.phone },
  description: { type: String },
  contact_no: { type: String },
  vendor_description: { type: String },
  vendor_contact_no: { type: String },

  payment_methods: 
    [
      {
        payment_id:{type:String},
        type:{type:String},
        card_last_digits: {type:String},
        exp_month: {type:String},
        exp_year: {type:String}
      }
    ],
  address:
  [
    {
      nick_name: { type: String, maxlength: max_length.long },
      address: { type: String, maxlength: max_length.long },
      appartment: { type: String, maxlength: max_length.long },
      country: { type: String, maxlength: max_length.short },
      state: { type: String,  maxlength: max_length.short },
      city: { type: String,  maxlength: max_length.short },
      zipcode: { type: String,  maxlength: max_length.short },
      default: { type: Boolean, default: false },
    }
  ],
  vendor_address:
  [
    {
      nick_name: { type: String, maxlength: max_length.long },
      address: { type: String, maxlength: max_length.long },
      appartment: { type: String, maxlength: max_length.long },
      country: { type: String, maxlength: max_length.short },
      state: { type: String,  maxlength: max_length.short },
      city: { type: String,  maxlength: max_length.short },
      zipcode: { type: String,  maxlength: max_length.short },
      default: { type: Boolean, default: false },
    }
  ],

  settings:
  [
    {
      key: { type: String, maxlength: max_length.short },
      description: { type: String, maxlength: max_length.long },
      value: { type: String, maxlength: max_length.long },
    }
  ],
  profile_image: [{ type: String, maxlength: max_length.medium }],
  type: [{ type: String }],
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
  login_with_google: { type: Boolean, default: false },  
  google_sub: { type: String },
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
