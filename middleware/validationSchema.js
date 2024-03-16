const { body } = require('express-validator');

const validationSchema = () => {
    return [
        body('title')
            .isLength({min: 2})
            .withMessage('title at least is 2 chars'),
        body('price')
            .notEmpty()
            .withMessage('price is required')
    ]
}

module.exports = validationSchema