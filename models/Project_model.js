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
    ref: "service_category",
    required: true
  },
  budget: { type: Number},
  location: { type: String, required: true },
  latlong: { 
    lat:{type: String, required: true },
    long:{type: String, required: true }
  },
  final_price: { type: Number },
  extra_price: [
    {
      price: { type: Number },
      desc: { type: String },
    }
  ],
  final_approved_proposal: [
    {
      proposal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "proposal" 
      },
      vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vendor" 
      },

    }
  ],
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
  status: { type: String, default: "active" }, //active, inactive
});

module.exports = mongoose.model("projects", schema, "projects");
