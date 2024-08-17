const { Schema, model, Types } = require('mongoose');

const TodoSchema = new Schema({
    title: {
        type: String,
        required: true, // Поле обязательно для заполнения
    },
    order: {
        type: Number,
        default: 0, // Начальное значение порядка
    },
    isCompleted: {
        type: Boolean,
        default: false, // Задача по умолчанию не выполнена
    },
    userId: {
        type: Types.ObjectId,
        ref: 'TodoUser', // Ссылка на пользователя, к которому относится задача
        required: true,
    },
}, {
    timestamps: true, // Автоматически добавляет поля createdAt и updatedAt
});

module.exports = model('Todo', TodoSchema);