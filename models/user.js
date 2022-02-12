const mongoose = require('mongoose')

const usernameValidator = username => {
  if (/\W+/.test(username)) return false
  else return true
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 4,
    required: true,
    validate: [usernameValidator, '{VALUE} must not contain special characters.']
  },
  passwordHash: String,
  name: String
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User