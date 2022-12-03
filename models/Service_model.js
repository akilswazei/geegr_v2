const mongoose = require("mongoose"),
  variable = require("./../helper/validation/variable"),
  min_length = variable.min_length,
  max_length = variable.max_length;



const schema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: max_length.medium },
  description: { type: String, maxlength: max_length.long },
  category: {
    type: mongoose.Schema.Types.ObjectId,
     required: true,
    ref: "service_category",
  },
  sub_category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "service_category",
  },
  service_charge: { type: Number, required: true },
  skills: [{ type: String, required: true }],

  verified: { type: Boolean, default: true },

  // reviews: [{      
  //     recommendation: { type: Boolean, required: true },
  //     on_time: { type: Boolean, required: true },
  //     on_budget: { type: Boolean, required: true },
  //     rating: { type: Number, required: true,maxlength: 5 },
  //     proposal_id: { type: mongoose.Schema.Types.ObjectId, ref: "proposal" } 
  //   }
  // ],

  display_image: { type: String, maxlength: max_length.medium },
  extrnal_url: { type: String },



  unit_price: [
    {
      unit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category_unit",
        required: true,
      },
      price: { type: String, required: true, maxlength: max_length.short },
    },
  ],

  rejection_message: {
    type: String,
    default: "sorry I am not free",
    minlength: min_length.specific.rejection_message,
    maxlength: max_length.long,
  },
  created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users" 
    },    
  created_at: { type: Date, default: Date.now },  
  updated_at: { type: Date },
  deleted_at: { type: Date },
  deleted: { type: Boolean, default: false },
  approval_status: { type: "string", default: "approved" }, //pending, approved, rejected
  status: { type: String, default: "active" }, //active, inactive
});

module.exports = mongoose.model("services", schema, "services");
