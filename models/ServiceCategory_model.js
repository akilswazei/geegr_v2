const mongoose = require("mongoose"),
  variable = require("./../helper/validation/variable"),
  max_length = variable.max_length;

const schema = new mongoose.Schema({
  type: { type: String, required: true }, //sub, parent
  title: { type: String, required: true, maxlength: max_length.medium },
  description: { type: String, required: true, maxlength: max_length.long },
  parent_category: { type: mongoose.Schema.Types.ObjectId },
  how_it_works: { type: Array, default: undefined },
  // units: {
  //   type: [mongoose.Schema.Types.ObjectId],
  //   ref: "category_unit",
  //   default: undefined,
  // },
  units: [{ type: mongoose.Schema.Types.ObjectId, ref: "category_unit" }],
  display_image: { type: String, maxlength: max_length.medium },
  banner_image: { type: String, maxlength: max_length.medium },
  banner_title: { type: String, maxlength: max_length.medium },
  banner_description: { type: String, maxlength: max_length.long },
  // tags: {
  //   type: [mongoose.Schema.Types.ObjectId],
  //   ref: "tags",
  //   default: undefined,
  // },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "tags" }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
  updated_by: { type: mongoose.Schema.Types.ObjectId },
  deleted_at: { type: Date },
  deleted_by: { type: mongoose.Schema.Types.ObjectId },
  deleted: { type: Boolean, default: false },
  status: { type: String, default: "active" }, //active, inactive
});

module.exports = mongoose.model("service_category", schema, "service_category");
