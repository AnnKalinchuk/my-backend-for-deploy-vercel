const { check } = require("express-validator");

const loginValidation = [
    check('email', "Enter correct email").isEmail(),
    check('password', 'Enter password').exists()
    //name
]

const registerValidation = [
    check('email', "Uncorrect email").isEmail(),
    check('password', 'Password must be longer than 6 and shorter than 20').isLength({min:6, max:20})
    //name
]

const createTodoValidation = [
    check('title','Create new task' ).exists()
]



module.exports = {
    loginValidation,
    registerValidation,
    createTodoValidation
}