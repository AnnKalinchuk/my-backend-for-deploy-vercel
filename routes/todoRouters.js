const { Router } = require("express");
const router = new Router();

const todoControllers = require('../controllers/TodoControllers');
const authMiddleware = require("../middleware/authMiddleware");
const { createTodoValidation } = require("../utils/validation");
const handleValidationErrors = require("../utils/handleValidationErrors");
const paginatedResults = require("../middleware/paginationMiddleware");
const Todo = require("../models/Todo");

router.post("/", authMiddleware, createTodoValidation, handleValidationErrors,todoControllers.createTodo);
router.get("/", authMiddleware, paginatedResults(Todo), todoControllers.getAllTodos);
router.put("/update-order", authMiddleware, todoControllers.updateTodosOrder);

router.patch('/:id', authMiddleware, todoControllers.updateTodo)


router.delete('/completed', authMiddleware, todoControllers.removeCompletedTodos); 
router.delete('/:id', authMiddleware, todoControllers.removeTodo);






module.exports = router;