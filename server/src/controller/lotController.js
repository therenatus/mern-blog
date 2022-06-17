import LotModel from "../models/lotModel.js";
import { validationResult } from 'express-validator';
import path from 'path';
import { v4 as uuidv4  } from 'uuid';
import * as url from 'url'


class LotController {
    async create (req, res,) {
        try {
            const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
            const now = Date.now();
            const errors =  validationResult(req);
            const { name, endDate, category, method, viewCount, count } = req.body;
            
            const { docs } = req.files;
            let fileName = uuidv4()+'.pdf';
            docs.mv(path.resolve( __dirname, '..', 'upload', fileName));
            console.log(docs.name)
            if(!errors.isEmpty()) {
                return res.status(400).json(errors.array());
            }
            const lot = new LotModel({name, endDate, category, doc: fileName, method, viewCount, count, author: req.userId, date: now});
            const doc = await lot.save();
            res.json(doc);
        } catch (error) {
            console.log(error)
            return res.status(500).json({message:'Create error'});
        }
    }

    async getAll(req, res) {
        try {
            const lots = await LotModel.find().populate('author').exec();
            res.json(lots);
        } catch (error) {
            console.log(error)
            return res.status(404).json({message:'Not found'});
        }
    }

    async getOne(req, res) {
        try {
            const lotId = req.params.id;
            LotModel.findByIdAndUpdate(
                {
                    _id: lotId,
                },
                {
                    $inc: { viewCount: 1}
                },
                {
                    returnDocument: 'after'
                },
                (err, doc) => {
                    if(err){
                        console.log(err)
                        return res.status(500).json({message:'Error'});
                    }

                    if(!doc){
                        return res.status(404).json({message:'Not found'});
                    }

                    res.json(doc);
                }
            ).populate('author')
        } catch (error) {
            console.log(error)
            return res.status(404).json({message:'Not found'});
        }
    }

    async remove(req, res) {
        try {
            
            const lotId = req.params.id;
    
            LotModel.findOneAndDelete(
                {
                    _id: lotId,
                },
                (err, doc) => {
                    if(err){
                        console.log(err)
                        return res.status(500).json({message:'Error'});
                    }

                    if(!doc){
                        return res.status(404).json({message:'Not found'});
                    }

                    res.json({success: true});
                }
            )
        } catch (error) {
                console.log(err);
                res.status(500).json({
                message: 'Не удалось получить статьи',
            });
        }
    }

    async update(req, res){
        try {
            const lotId = req.params.id;
            
            await LotModel.updateOne(
                {
                    _id: lotId
                },
                {
                    name: req.body.name, 
                    endDate: req.body.endDate, 
                    docs: req.body.docs,
                    category: req.body.category, 
                    method: req.body.method,
                }
            );
            res.json({
                success: true,
            })
        } catch (error) {
                console.log(err);
                res.status(500).json({
                message: 'Не удалось получить статьи',
                })
        }
    }
}

export { LotController}