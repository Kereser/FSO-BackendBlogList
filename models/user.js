const mongoose = require('mongoose')

const usernameValidator = username => {
  if (/\W+/.test(username)) return false
  else return true
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: [3, 'username \'{VALUE}\' must be at least 3 characters long'],
    required: true,
    validate: [usernameValidator, '{VALUE} must not contain special characters.']
  },
  passwordHash: String,
  name: String,
  blogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User