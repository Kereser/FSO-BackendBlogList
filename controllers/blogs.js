const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs.map(b => b.toJSON()))
})

blogsRouter.post('/', (req, res, next) => {
  const body = req.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  blog.save()
    .then(blog => {
      res.status(201).json(blog)
    })
    .catch(error => next(error))
})

module.exports = blogsRouter