import { body } from 'express-validator';

export const createLotValidations = [
    body('name').isLength({min: 5}).isString(),
    body('endDate').isString(),
    body('docs').optional().isString(),
    body('category').isString(),
    body('method').isString(),
]