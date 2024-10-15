const { Schema, model } = require("mongoose");
import { Schema } from "mongoose";

userCollection = "users";

const userSchema = new Schema({
    first_name: String,
    last_name: String,
    email: {
    type: String,
    unique: true,
    },
    age: Number,
    password: String(Hash),
  //cart: Id con referencia a Carts,
  //role: String(default:'user')
});

const userModel = model(userCollection, userSchema);

module.exports = {
    userModel
}