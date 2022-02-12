const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body

  const user = await User.findOne({ username })
  if (user) {
    return res.status(400).json({
      error: 'Username already exist'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  console.log(passwordHash)

  const newUser = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await newUser.save()
  console.log(`Este es el usuario guardado: ${savedUser}`)
  res.status(201).json(savedUser.toJSON())
})

usersRouter.get('/', async (req, res) => {
  const users = await User.find({})
  res.status(200).json(users.map(u => u.toJSON()))
})

module.exports = usersRouter