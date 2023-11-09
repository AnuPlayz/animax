"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    token: { type: String },
    bio: { type: String },
    isAdmin: { type: Boolean }
});
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
