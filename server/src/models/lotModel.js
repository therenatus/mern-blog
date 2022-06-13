import mongoose from "mongoose";

const LotSchema = new mongoose.Schema({
    name: {type: String, required: true},
    endDate: {type: Date, required: true},
    docs:  {type : String},
    category: {type: String, required: true},
    method: {type: String, required: true},
    viewCount: {type: Number, default: 0},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
})

export default mongoose.model('Lot', LotSchema);