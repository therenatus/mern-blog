import OfferModel from "../models/offerModel.js";
import { v4 as uuidv4  } from 'uuid';
import * as url from 'url';
import path from 'path';

class OfferController {
    async sendOffer(req, res) {
        try {
            const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
            const { userId, lotId } = req.body;
            const { file } = req.files
            let fileName = uuidv4()+'.pdf';
            file.mv(path.resolve( __dirname, '..', 'upload', fileName));
            const model = await new OfferModel({ userId, lotId, docs: fileName });
            const offer = await model.save();
            res.json(offer);
        } catch (error) {
            console.log(error);
            return res.status(400).json(error)
        }
    }
    async getAuthorOffer(req, res) {
        const data = await OfferModel.find({userId: req.userId}).populate('lotId userId').exec();
        res.json(data);
    }

    async getLotsOffers(req, res) {
        const data = await OfferModel.find({ lotId: req.params.id}).populate('lotId userId').exec();;
        res.json(data);
    }
}

export { OfferController }