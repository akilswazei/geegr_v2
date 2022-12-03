const variable = {};

variable.country_list = ["United States"];
variable.state_list = [];
variable.city_list = [];
// variable.serviceCategory_list = ["Cleaning", "Gardening", "Painting"];
variable.approvalStatus_list = {
  before: ["pending", "rejected"],
  after: ["approved", "suspended"],
  duringApproval: ["approved", "rejected"],
};
variable.status_list = ["active", "inactive"];
variable.default_commission = "10";
// variable.default_customer_order_cancellation_charges_percent = "10";
// variable.default_vendor_order_cancellation_charges_percent = "20";
variable.vendorRegistrationDocument_list = [
  "driving_license",
  "passport",
  "identity_card",
];
variable.serviceUnit_list = [
  "Flat Price",
  "Per Kg",
  "Per Litre",
  "Per Meter",
  "Per Sq. Feet",
  "Per Room",
];
variable.serviceCategoryType_list = ["parent", "sub"];
variable.rating_list = [1, 2, 3, 4, 5];
variable.resetPasswordLinkExpTime = 10; //10 mins

variable.max_length = {
  long: 255,
  medium: 100,
  short: 50,
  specific: {
    phone: 10,
    zipcode: 10,
    pan_number: 10,
  },
};

variable.min_length = {
  specific: {
    address: 10,
    rejection_message: 10,
  },
};

module.exports = variable;
