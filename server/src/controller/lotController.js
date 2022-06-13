import LotModel from "../models/lotModel.js";
import { validationResult } from 'express-validator';

class LotController {
    async create (req, res) {
        try {
            const errors =  validationResult(req);
            const { name, endDate, docs, category, method, viewCount, count } = req.body;
            if(!errors.isEmpty()) {
                return res.status(400).json(errors.array());
            }
            const lot = new LotModel({name, endDate, docs, category, method, viewCount, count, author: req.userId});
            const doc = await lot.save();
            res.json(doc);
        } catch (error) {
            console.log(error)
            return res.status(500).json({message:'registration error'});
        }
    }
}

export { LotController}