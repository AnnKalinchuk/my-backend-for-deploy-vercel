const c = require("config");
const Todo = require("../models/Todo")
const User = require("../models/TodoUser")

const createTodo = async (req, res) => {
    const userId = req.user.id; // Извлечение userId из декодированных данных JWT

    try {
        // Получение текущих задач пользователя и определение максимального порядка
        const todos = await Todo.find({ userId }).sort('order');
        const maxOrder = todos.length > 0 ? todos[todos.length - 1].order : 0;


        const todo = new Todo({
            title:req.body.title,
            isCompleted: false,
            userId,
            order: maxOrder + 1,
        })
    
    await todo.save()
        res.status(201).json({message: 'Todo was created', todo})
    
    } catch (e) {
        console.log(e)
        res.status(500).json({message: e.message})
    }
    
}

const getAllTodos = async (req, res) => {
    try {
      res.status(200).json(res.paginatedResults);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: 'Failed to get todos' });
    }
  };

  const updateTodosOrder = async (req, res) => {
    const { todos } = req.body; // Получаем массив задач с их новыми порядками

    try {

        await Promise.all(
            todos.map(todo => 
                Todo.findByIdAndUpdate(
                    todo.id,
                    { order: todo.order },
                    { new: true }
                )
            )
        );

        res.status(200).json({ message: 'Order updated successfully' });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Failed to update order' });
    }
};

const updateTodo = async (req, res) => {
    try {
        const updatedTodo = {
            isCompleted: req.body.isCompleted
        }
    
        
        const todo = await Todo.findOneAndUpdate(
                {_id:req.params.id},
                {$set: updatedTodo},
                {new:true}
        )


         if (!todo) {
            return res.status(404).json({ success: false, message: 'Todo not found' });
        }


        res.status(200).json({success: true, todo, message: 'Todo was updated'})
    
    } catch (e) {
        console.log(e)
        res.status(500).json({message: e.message/* 'Failed to update todo' */})
    }
}

const reorderTodos = async (userId) => {
    try {
        console.log('reorderTodos')
        // Получение всех задач пользователя, отсортированных по текущему порядку
        const todos = await Todo.find({ userId }).sort('order');

        // Переназначение порядка задач
        for (let i = 0; i < todos.length; i++) {
            todos[i].order = i + 1;
            await todos[i].save(); // Сохранение изменений
        }

        return { success: true, message: 'Todos reordered successfully' };
    } catch (e) {
        console.error(e);
        throw new Error('Failed to reorder todos');
    }
};

const removeTodo = async (req, res) => {
    try {
        const todoId = req.params.id;

        // Удаление задачи по её ID
        const todoToRemove = await Todo.findByIdAndDelete(todoId);

        // Проверить, существует ли задача
        if (!todoToRemove) {
            return res.status(404).json({ message: 'Todo not found' });
        }
         // Отладочный лог
         console.log('Todo removed:', todoToRemove);


         // Обновление порядка всех оставшихся задач
         await Todo.updateMany(
            { userId: todoToRemove.userId, order: { $gt: todoToRemove.order } },
            { $inc: { order: -1 } }
        );

        // Возврат успешного ответа
        res.status(200).json({ message: 'Todo deleted successfully', todo:todoToRemove });
    
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message });
    }
}

const removeCompletedTodos = async (req, res) => {
    try {
        // Получаем ID пользователя из токена
        const userId = req.user.id;
     

        // Удаляем все завершённые задачи пользователя
        const result = await Todo.deleteMany({ userId, isCompleted: true });
       

        // Пересортировка оставшихся задач
        const todos = await Todo.find({ userId }).sort('order');
    

        // Обновляем порядок оставшихся задач
        for (let i = 0; i < todos.length; i++) {
            todos[i].order = i + 1;
            await todos[i].save();
        }

        res.status(200).json({ 
            success: true, 
            message: 'Completed todos removed and order updated successfully',
            todos
        });

    } catch (e) {
        res.status(500).json({ 
            message: 'Failed to remove completed todos',
            error: e.message 
        });
    }
}

module.exports = {
    createTodo,
    getAllTodos,
    updateTodosOrder,
    updateTodo,
    removeTodo,
    removeCompletedTodos
}