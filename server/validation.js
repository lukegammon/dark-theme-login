const Joi = require("joi");

const loginValidation = async (email, password) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });
    try {
        const value = await schema.validateAsync({email, password});
        return true;
    } catch(error) {
        const message = error.message;
        return message;
    }
}

module.exports = loginValidation;