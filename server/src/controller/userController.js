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
    async registration(req, res){
        try {
            const errors =  validationResult(req);
            const { name, lastName, company, number, website, email, innCode, pinCode, password, roles } = req.body;
            console.log(req.body)
            const hasUser = await User.findOne({email});
            console.log(hasUser)
            if(!errors.isEmpty()) {
                return res.status(400).json(errors.array());
            }
            if (hasUser) {
                return res.status(400).json({message:'Пользователь с таким email уже существует'})
            }
            const hashPassword = await bcrypt.hash(password, 7);
            const profile = new User({name, lastName, company, number, website, email,  innCode, pinCode, roles,password: hashPassword})
            const user = await profile.save();
            const token = generateJwt(user._id, user.email, user.roles);
    
            res.json({user, token})
        }catch(err) {
            console.log(err)
            res.status(500).send({message:'registration error'})
        }
    }

    async login(req, res) {
        try {
            // const errors =  validationResult(req);
            console.log(req.body)
            const { email, password } = req.body;
            const user = await User.findOne({email});
            // if(!errors.isEmpty()) {
            //     return res.status(400).json(errors.array());
            // }
            if (!user) {
                return res.status(404).json({message:'Пользователь не найден'})
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(403).json({message:'Hеверный пароль'})
            }

            const token = generateJwt(user.id, user.email, user.roles)
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
        
            res.json(user);
          } catch (err) {
            console.log(err);
            res.status(403).json({
              message: 'Нет доступа',
            });
          }
    }

    async getAll(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (error) {
            return res.status(404).json({ error: error });
        }
    }

}

export { UserController}