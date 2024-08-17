//const jwt = require("jsonwebtoken"); ///удалить?
const bcrypt = require("bcryptjs");
//const config = require("config"); ///удалить?
//const { validationResult } = require("express-validator");
const User = require("../models/TodoUser");
const Role = require("../models/Role");
const generateAccessToken = require("../utils/generateAccessToken");

const login = async (req, res) => {
    
  try {
      console.log('login')
      console.log('Raw request body:', req.body);  // Добавлено для отладки
      const {email, password} = req.body
     /*  const normalizedEmail = email.toLowerCase(); */  // Приведение email к нижнему регистру
      const user = await User.findOne({email})
      console.log('user', user)

      if (!user) {
          return res.status(404).json({message: "User is not found"})
      }
      const isPassValid = bcrypt.compareSync(password, user.password)
      if (!isPassValid) {
          return res.status(400).json({message: "Invalid login or password"})
      }

      const token = generateAccessToken(user._id, user.roles)

      return res.json({
          token,
          user: {
              id: user._id,
              email: user.email,
              roles: user.roles,
              name: user.name
          }
      })
  } catch (e) {
      res.status(500).json({
          message: `Failed to login, e - ${e}`
      })
  }
}

const register = async (req, res) => {
  try {

      const {email, password, name} = req.body
    
      const candidate = await User.findOne({email})

      if(candidate) {
          return res.status(400).json({
              message: `User with email ${email} already exist`
          })
      }

      const hashPassword = await bcrypt.hash(password, 12)
      const userRole = await Role.findOne({value: "USER"})
      const user = new User({email, password: hashPassword, name, roles:[userRole.value]})
     // const user = new User({email, password: hashPassword, name, roles:[userRole.value, "ADMIN"]})

      await user.save()

      const token = generateAccessToken(user._id, user.roles)

      return res.status(201).json({
          message: 'User was created', 
          user: {
              id: user._id,
              email: user.email,
              roles: user.roles,
              name: user.name
          },
          token
      })
  } catch (e) {
      console.log(e)
      res.status(500).json({
          message: 'Failed to register'
      })
  }
}

const getUsers = async (req, res) => {
  try {
      const users = await User.find()
      res.json(users)
  } catch (error) {
      console.log(e)
  }
}


module.exports = {
  login,
  register,
  getUsers,
};
