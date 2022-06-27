import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        lastName: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true, select: false},
        logo: String,
        roles: { type: Array, 'default': ["USER"]},
        company: {type: String, required: true}, 
        website: {type: String, }, 
        innCode: {type: String, required: true}, 
        pinCode: {type: String, required: true},
        },
    {
        timestamps: true,
    }
)

export default mongoose.model('User', UserSchema)