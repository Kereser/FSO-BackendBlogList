const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog
    .find({}).populate('user')

  res.json(blogs.map(b => b.toJSON()))
})

blogsRouter.post('/', async (req, res) => {
  const body = req.body
  const decodedToken = jwt.verify(req.token, process.env.SECRET)

  if(!decodedToken) {
    return res.status(401).json({
      error: 'Invalid or missing token'
    })
  }

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    user: user._id,
    likes: body.likes || 0
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  res.status(201).json(savedBlog.toJSON())
})

blogsRouter.put('/:id', async (req, res) => {
  const body = req.body

  const newBlog = {
    likes: body.likes
  }

  const updatedBlog = await 
  Blog.findByIdAndUpdate(req.params.id, newBlog, { new: true })
  res.json(updatedBlog.toJSON())
})

blogsRouter.delete('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  const decodedToken = jwt.verify(req.token, process.env.SECRET)

  if (blog.user.toString() !== decodedToken.id) {
    return res.status(401).json({
      error: 'Can\'t delete the blog because you are not the owner.'
    })
  }

  await Blog.findByIdAndDelete(blog._id)
  res.status(204).end()
})

module.exports = blogsRouter