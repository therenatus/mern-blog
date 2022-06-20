import mongoose from "mongoose";

const OfferSchema = new mongoose.Schema({
    docs:  {type : String},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    lotId:  {type: mongoose.Schema.Types.ObjectId, ref: 'Lot', required: true},
})

export default mongoose.model('Offer', OfferSchema);