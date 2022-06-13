import { body } from 'express-validator';

export const registerValidations = [
    body('email').isEmail(),
    body('password').isLength({min:5}),
    body('name').isLength({min:3}),
    body('company').isLength({min:3}),
    body('avatar').optional().isURL(),
];

export const loginValidators = [
    body('email').isEmail(),
    body('password').isLength({min:5}),
]
