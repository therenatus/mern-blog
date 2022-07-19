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
            const { name, endDate, category, method } = req.body;
            const { docs } = req.files
            let fileName = uuidv4()+'.pdf';
            docs.mv(path.resolve( __dirname, '..', 'upload', fileName));
            if(!errors.isEmpty()) {
                console.log(errors)
                return res.status(400).json(errors.array());
            }
            const lot = new LotModel({name, endDate, category, doc: fileName, method, author: req.userId, date: now});
            const doc = await lot.save();
            res.json(doc);
        } catch (error) {
            console.log(error)
            return res.status(500).json({message:'Create error'});
        }
    }

    async getAll(req, res) {
        try {
            const { page = 1, limit = 10, sort = 'desc', category} = req.query;
            console.log(page)
            let filter = {};
            let sortBy;
            if(category){
                filter = { category: category}
            }
            if(sort === 'desc'){
                sortBy = -1;
            }
            if(sort === 'asc'){
                sortBy = 1;
            }
            const totalCount = await LotModel.countDocuments(filter)
                .sort({'date': sortBy})
                .exec();
            const lots = await LotModel.find(filter)
                .limit(limit *1)
                .skip((page-1)*limit)
                .sort({'date': sortBy})
                .populate('author')
                .exec();
            res.json({lots, pagination: { totalCount, offset: page - 1, count: limit}});
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

    async changeView(req, res) {
        try {
            const lotId = req.params.id;
            LotModel.findByIdAndUpdate(
                {
                    _id: lotId,
                },
                {
                    $set: { isOpen: true}
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

    async search(req, res) {
        try {
            const { page = 1, limit = 10, sort = 'desc', key } = req.query;
            let sortBy;
            if(sort === 'desc'){
                sortBy = -1;
            }
            if(sort === 'asc'){
                sortBy = 1;
            }
            const totalCount = await LotModel.countDocuments({
                "$or": [
                    { name: {$regex: key}},
                    // { description: {$regex: req.query.key}}
                    
                ]
            }).sort({'date': sortBy})
                .exec();
            const lots = await LotModel.find({
                "$or": [
                    { name: {$regex: key}},
                    // { description: {$regex: req.query.key}}
                    
                ]
            }).limit(limit *1)
                .skip((page-1)*limit)
                .sort({'date': sortBy})
                .populate('author')
                .exec();

            res.json({lots, pagination: { totalCount, offset: page - 1, count: limit}});
        } catch (error) {
            console.log(error)
            return res.status(400).json({message:'Not found'});
        }
    }
}

export { LotController}