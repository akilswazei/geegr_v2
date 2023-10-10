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
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: "media"}],  
  budget: { type: Number, default: 100},
  min_budget: { type: Number}, 
  description: { type: String},  
  line_items:[
      {
        title: { type: String,default:""},
        description: { type: String,default:""},
        budget: { type: Number,default:0},
        status:  { type: String,default:""},  // acceted, started, completed, not completed,    
        created_at: { type: Date, default: Date.now },
        accepted_at:{ type: Date },
        time: {type: "string", default:"before"}
      }
    ],

   todo:[
      {
        title: { type: String,default:""},
        description: { type: String,default:""},
        budget: { type: Number,default:0},
        status:  { type: String,default:""},  // acceted, started, completed, not completed,    
        created_at: { type: Date, default: Date.now },
        started_at:{ type: Date },
        completed_at:{ type: Date }
      }
    ], 
  extra_price: [
    {
      price: { type: Number },
      desc: { type: String },
    }
  ],
  payment_released: { type: Number},
  review_from_customer:{
     recommendation: { type: Boolean },
     on_time: { type: Boolean },
     on_budget: { type: Boolean},
     rating: { type: Number},
     comment: { type: String },    
  },
  review_from_vendor:{
     recommendation: { type: Boolean },
     on_time: { type: Boolean },
     on_budget: { type: Boolean},
     rating: { type: Number},
     comment: { type: String },    
  },   
  accepted_at:{ type: Date },
  started_at:{ type: Date },
  completed_at:{ type: Date }, 
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
  deleted_at: { type: Date },
  deleted: { type: Boolean, default: false },
  // approval_status: { type: "string", default: "pending" }, //pending, approved, rejected
  // complete_status: { type: "string"}, //complete
  status: { type: String, default: "active" }, //active, approved, completed,rejected,archived inactive
});

module.exports = mongoose.model("proposals", schema, "proposals");
