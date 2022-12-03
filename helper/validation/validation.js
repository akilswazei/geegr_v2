const variable = require("./variable");
let validation = {};

validation.validateName = (name) => {
  // const regex = /^[0-9a-zA-Z ]+$/;
  const regex = /^[a-zA-Z ]*$/;
  return regex.test(String(name));
};

validation.validateEmail = (email) => {
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(email).toLowerCase());
};

validation.validatePassword = (password) => {
  const regex =
    /^(?!.* )(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*_.-]).{8,20}$/;
  return regex.test(String(password));
};

validation.validatePhone = (phone) => {
  const regex = /^[0-9]{10}$/;
  return regex.test(String(phone));
};

validation.validateGeneralString = (_string) => {
  // const regex = /^[a-zA-Z0-9\s,.'-]{3,500}$/; //for address
  const regex = /^[a-zA-Z0-9\s,.'-]+$/;
  return regex.test(String(_string));
};

validation.validateZipcode = (zipcode) => {
  // const regex = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
  const regex = /^[0-9-]{0,10}$/;
  return regex.test(String(zipcode));
};

validation.validateDiscountCouponName = (code) => {
  const regex = /^[A-Z0-9]*$/;
  return regex.test(String(code));
};

validation.validateLocation = (key, value) => {
  const list =
    key === "country"
      ? variable.country_list
      : key === "state"
      ? variable.state_list
      : variable.city_list;
  const result = list.find((item) => {
    return item.toLowerCase() === value.toLowerCase();
  });
  return result;
};

validation.validateServiceCategoryType = (type) => {
  const result = variable.serviceCategoryType_list.find((item) => {
    return item.toLowerCase() === type.toLowerCase();
  });
  return result;
};

validation.validateServiceUnits = (units) => {
  let result;
  for (let i = 0; i < units.length; i++) {
    result = variable.serviceUnit_list.find((item) => {
      return item === units[i];
    });

    if (!result) {
      return false;
    } else if (i === units.length - 1) {
      return true;
    }
  }
};

// validation.validateServiceCategory = (category) => {
//   const result = variable.serviceCategory_list.find((item) => {
//     return item.toLowerCase() === category.toLowerCase();
//   });
//   return result;
// };

validation.validateApprovalStatusBeforeApproval = (approval_status) => {
  const result = variable.approvalStatus_list.before.find((item) => {
    return item.toLowerCase() === approval_status.toLowerCase();
  });
  return result;
};

validation.validateApprovalStatusAfterApproval = (approval_status) => {
  const result = variable.approvalStatus_list.after.find((item) => {
    return item.toLowerCase() === approval_status.toLowerCase();
  });
  return result;
};

validation.validateApprovalStatusDuringApproval = (approval_status) => {
  const result = variable.approvalStatus_list.duringApproval.find((item) => {
    return item.toLowerCase() === approval_status.toLowerCase();
  });
  return result;
};

validation.validateStatus = (status) => {
  const result = variable.status_list.find((item) => {
    return item.toLowerCase() == status.toLowerCase();
  });
  return result;
};

validation.validateRating = (rating) => {
  const result = variable.rating_list.find((item) => {
    return String(item) === String(rating);
  });
  return result;
};

validation.validateBoolean = (val) => {
  let result;
  // const boolVal = val.toLowerCase();
  if (val == true || val == false) {
    result = val;
  }
  return result;
};

// validation.validateAdminCommissionType = (admin_commission_type) => {
//   const result = variable.commissionType_list.find((item) => {
//     return item.toLowerCase() === admin_commission_type.toLowerCase();
//   });
//   return result;
// };

// validation.validateAdminCommissionValue = (
//   admin_commission_type,
//   admin_commission_value
// ) => {
//   return (
//     (admin_commission_type === "flat" && admin_commission_value >= 0) ||
//     (admin_commission_type === "percentage" &&
//       admin_commission_value >= 0 &&
//       admin_commission_value <= 100)
//   );
// };

validation.validatePercentage = (percentage) => {
  const result = percentage >= 0 && percentage <= 100 ? percentage : null;
  return result;
};

// validation.validatePositiveNumber = (number) => {
//   if (typeof number !== "number") return false;

//   const test = Math.sign(number);
//   if (test < 0) return false;

//   return true;
// };

validation.validatePositiveNumber = (number) => {
  return number >= 0;
};

validation.validateNaturalNumber = (number) => {
  number = number.toString();
  const number1 = Math.abs(number),
    number2 = parseInt(number, 10);
  return (
    !isNaN(number1) &&
    number2 === number1 &&
    number1.toString() === number &&
    number != 0
  );
};

validation.validateVendorRegistrationDocumentType = (document_type) => {
  const result = variable.vendorRegistrationDocument_list.find((item) => {
    return item.toLowerCase() == document_type.toLowerCase();
  });
  return result;
};

// exports.validation = validation;
module.exports = validation;
