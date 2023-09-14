import mongoose from "mongoose";

let UserSchema = mongoose.Schema({
  name: { type: String },
  photo: { type: String },
  username: { type: String, index: true },
  email: { type: String, index: true },
  password: { type: String },
});

let User = mongoose.model("user", UserSchema);

export default User;
