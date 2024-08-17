const { Router } = require("express");
const router = new Router();

const todoUserControllers = require('../controllers/TodoAuthControllers');
const roleMiddleware = require("../middleware/roleMiddleware");
const { registerValidation, loginValidation } = require("../utils/validation");
const handleValidationErrors = require("../utils/handleValidationErrors");

router.post("/register",  registerValidation, handleValidationErrors, todoUserControllers.register);

router.post('/login', loginValidation, handleValidationErrors, todoUserControllers.login)

router.get('/users', roleMiddleware(['ADMIN']), todoUserControllers.getUsers)


module.exports = router;

