const { Schema, model } = require("mongoose");

const TodoUserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: [{
    type: String,
    ref: 'TodoRole'
}]
});

module.exports = model("TodoUser", TodoUserSchema);
