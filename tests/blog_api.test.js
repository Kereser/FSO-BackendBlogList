const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const Blog = require('../models/blog')
const helper = require('./blog_helper')

const api = supertest(app)

beforeEach( async () => {
  jest.setTimeout(100000)
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs.map(b => new Blog(b))
  const promiseArray = blogObjects.map(b => b.save()) 
  await Promise.all(promiseArray)
})


test('correct blogs length returned', async () => {
  const blogsAtStart = await helper.blogsInDB()

  const result = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /json/)

  expect(result.body).toHaveLength(blogsAtStart.length)
})



afterAll(() => {
  mongoose.connection.close()
})