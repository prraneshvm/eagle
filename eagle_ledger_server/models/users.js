// const mongoose = require('mongoose')

// const UserSchema = new mongoose.Schema({
//     id: String
// })

// const UserModel = mongoose.model.apply("users", UserSchema)
// module.exports = UserModel

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  id: String,
  loaneeDetailsData: Object,
  guaranteeDetailsData: Object,
  vehicleDetailsData: Object,
  loanDetailsData: Object,
  installmentsData: Object
});

// const logInSchema = new mongoose.Schema({
//   name: {
//       type: String,
//       required: true
//   },
//   password: {
//       type: String,
//       required: true
//   }
// });

const UserModel = mongoose.model("User", UserSchema); // Corrected line
module.exports = UserModel;

// const LogInCollection = mongoose.model('logincollections', logInSchema);
// module.exports = LogInCollection;
