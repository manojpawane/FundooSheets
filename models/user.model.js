const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    email: { type: String, require: [true, "Email is required field"] },
    password: { type: String, require: [true, "Password is required field"] },
    status: { type: Boolean, required: false, default: true }
},
    {
        timestamps: true
    }
);

const users = mongoose.model("users", userSchema);
module.exports = users;
