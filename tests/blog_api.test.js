const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const Blog = require('../models/blog')
const helper = require('./blog_helper')

const api = supertest(app)

beforeEach( async () => {
  jest.setTimeout(10000)
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

test('unique identifier property = id', async () => {
  
  const result = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /json/)

  const ids = result.body.map(b => b.id)
  expect(ids).toBeDefined()
})

test('Creates a new blog post', async () => {
  jest.setTimeout(10000)
  const newBlog = {
    title: "Pakita la del barrio",
    author: "Cevichito",
    url: "https://cechicheria.com.co",
    likes: 2
  }

  const result = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /json/)

  const blogsAtEnd = await helper.blogsInDB()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  expect(titles).toContain(result.body.title)
})

test('No likes in request', async () => {
  const newBlog = {
    title: "Pakita la del barrio",
    author: "Cevichito",
    url: "https://cechicheria.com.co"
  }

  const result = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /json/)

  expect(result.body.likes).toBe(0)
})

test('Missing title', async () => {
  const newBlog = {
    author: "Cevichito",
    url: "https://cechicheria.com.co",
    likes: 100
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('Missing url', async () => {
  const newBlog = {
    title: "Sirenam",
    author: "Cevichito",
    likes: 100
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})


afterAll(() => {
  mongoose.connection.close()
})