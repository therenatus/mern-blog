import OfferModel from "../models/offerModel.js";
import { v4 as uuidv4  } from 'uuid';
import * as url from 'url';
import path from 'path';

class OfferController {
    async sendOffer(req, res) {
        try {
            const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
            const { userId, lotId } = req.body;
            console.log(req)
            const {file} = req.files
            console.log(file)
            let fileName = uuidv4()+'.pdf';
            file.mv(path.resolve( __dirname, '..', 'upload', fileName));
            const model = await new OfferModel({ userId, lotId, docs: fileName });
            console.log(model)
            const offer = await model.save();
            console.log(offer);
            res.json(offer);
        } catch (error) {
            console.log(error);
            return res.status(400).json(error)
        }
    }
    async getAuthorOffer(req, res) {
        console.log(req.userId)
        const data = await OfferModel.find({userId: req.userId}).populate('lotId').exec();
        res.json(data);
    }

    async getLotsOffers(req, res) {
        console.log(req)
        const data = await OfferModel.find({lotId: req.body.lotId});
        res.json(data);
    }
}

export { OfferController }