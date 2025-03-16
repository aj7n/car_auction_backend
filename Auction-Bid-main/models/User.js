const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Auto-generate _id
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  createddate: { type: Date, default: Date.now }, // Auto-set createddate
});

module.exports = mongoose.model("User", UserSchema);
