const generator = require("generate-password");

exports.generateRandomPassword = async () => {
  const password = await generator.generate({
    length: 10,
    numbers: true,
  });
  return password;
};

// const bcrypt = require("bcryptjs");
// const aa = async () => {
//   console.log(await bcrypt.hash("Admin.one1", 10));
// };
// aa();
