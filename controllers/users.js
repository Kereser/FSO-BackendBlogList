const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.get('/', async (req, res) => {
  const users = await User
    .find({}).populate('blogs')

  res.status(200).json(users.map(u => u.toJSON()))
})


usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body

  const user = await User.findOne({ username })
  if (user) {
    return res.status(400).json({
      error: 'Username already exist'
    })
  } 
  if (password.length < 3 || !password) {
    return res.status(400).json({
      error: 'Password doesn\'t meet the requirements'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const newUser = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await newUser.save()
  res.status(201).json(savedUser.toJSON())
})


module.exports = usersRouter