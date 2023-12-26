const mongoose = require("mongoose"),
  variable = require("./../helper/validation/variable"),
  min_length = variable.min_length,
  max_length = variable.max_length;

const schema = new mongoose.Schema({

  title: { type: String, required: true, maxlength: max_length.medium },
  description: { type: String, maxlength: max_length.long },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: "service_category",
    required: true
  },
  sub_category: {
    type: mongoose.Schema.Types.ObjectId,
    //required: true,
    ref: "service_category"
  },
  budget: { type: Number},
  location: { type: String, required: true },


  street_name: { type: String},
  unit: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipcode: { type: String, required: true },
  max_radius: { type: Number, required: true },
  is_shareable: { type: Boolean, required: true },
  is_immediate: { type: Boolean, required: true },
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: "media"}],

  latlong: { 
    lat:{type: String, required: true },
    long:{type: String, required: true }
  },
  final_approved_price: { type: Number },
  final_approved_proposal: {
    type: mongoose.Schema.Types.ObjectId,
    //required: true,
    ref: "proposals"
  },
  final_approved_service: {
    type: mongoose.Schema.Types.ObjectId,
    //required: true,
    ref: "services",
  },
  final_approved_user: {
    type: mongoose.Schema.Types.ObjectId,
    //required: true,
    ref: "users"
  },
  total_paid: { type: Number },
  created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users" 
      },
  created_at: { type: Date, default: Date.now },
  // created_by_model: {
  //   type: String,
  //   required: true,
  //   enum: ["vendors"], //Possible model names like vendors for populate
  // },
  updated_at: { type: Date },
  
  deleted_at: { type: Date },
  deleted: { type: Boolean, default: false },
  
  assigned: { type: Boolean, default: false },
  assigned_at: { type: Date },

  status: { type: String, default: "active" }, //active, inactive

  // inactive : if expired, if done
  // active: assigned and not assigned

});

module.exports = mongoose.model("projects", schema, "projects");
