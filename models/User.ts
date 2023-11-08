import { Schema, model } from "mongoose";

interface User {
    name: string;
    password: string;
    token: string;
    bio: string;
}

const userSchema = new Schema<User>({
    name: { type: String, required: true},
    password: { type: String, required: true},
    token: { type: String },
    bio: { type: String }
});

const User = model<User>('User', userSchema);

export default User;
