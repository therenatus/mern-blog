import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import dotenv from 'dotenv';
dotenv.config();

import { validationResult } from 'express-validator';
import  User  from "../models/userModel.js";
import ApiError from "../../error/ApiError.js";

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role}, 
        process.env.JWT_SECRET,
        { 
            expiresIn: '7d'
        }
    )
}

class UserController {

    async createModerator(req, res) {
        try {
            const hasUser = await User.find({ email: req.body.email });
            if(!errors.isEmpty()) {
                return res.status(400).json(errors.array());
            }
            if(hasUser) {
                return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
            }
            const hashPassword = await bcrypt.hash(req.body.password, 7);
            const profile = new User({ 
                name: req.body.name,
                lastName: req.body.lastName, 
                number: req.body.number, 
                innCode: '123456', 
                pinCode: req.body.pinCode, 
                password: hashPassword, 
                email: req.body.email, 
                company: req.body.company, 
                webSite: req.body.webSite, 
                roles: req.body.role });
            const user = await profile.save();
            const token = generateJwt(user._id, user._roles);
            const {password, ...userData} = user._doc;
            res.json({userData, token}); 
        } catch (error) {
            
        }
    }

    async registration(req, res){
        try {
            const errors =  validationResult(req);
            const hasUser = await User.findOne({email: req.body.email});
            if(!errors.isEmpty()) {
                return res.status(400).json(errors.array());
            }
            if (hasUser) {
                return res.status(400).json({message:'Пользователь с таким email уже существует'});
            }
            const hashPassword = await bcrypt.hash(password, 7);
            const profile = new User({
                name: req.body.name, 
                lastName:req.body.lastName, 
                company: req.body.company, 
                number: req.body.number,
                webSite: req.body.website, 
                email: req.body.email,  
                innCode: req.body.innCode, 
                pinCode: req.body.pinCode, 
                password: hashPassword
            })
            const user = await profile.save();
            const token = generateJwt(user._id, user.roles);
            const {password, ...userData} = user._doc;
            res.json({userData, token}); 
        }catch(err) {
            console.log(err)
            res.status(500).send({message:'registration error'})
        }
    }

    async login(req, res) {
        try {
            // const errors =  validationResult(req);
            const user = await User.findOne({email: req.body.email}).select('+password');
            // if(!errors.isEmpty()) {
            //     return res.status(400).json(errors.array());
            // }
            if (!user) {
                return res.status(404).json({message:'Пользователь не найден'})
            }

            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                return res.status(403).json({message:'Hеверный пароль'})
            }
            const token = generateJwt(user._id, user.roles);
            res.json({user, token})
        } catch (error) {
            console.log(error)
            res.status(500).send({message:'auth error'})
        }
    }

    async getMe(req, res) {
        try {
            const user = await User.findById(req.userId);
        
            if (!user) {
              return res.status(403).json({
                message: 'Пользователь не найден',
              });
            }
        
            res.json({user});
          } catch (err) {
            console.log(err);
            res.status(403).json({
              message: 'Нет доступа',
            });
          }
    }

    async getAll(req, res) {
        try {
            const users = await User.find().select('-password');
            res.json(users);
        } catch (error) {
            return res.status(404).json({ error: error });
        }
    }

}

export { UserController}