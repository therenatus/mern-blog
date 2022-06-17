import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        logo: String,
        roles: [{type: String, ref: 'Role', default: 'USER'}],
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