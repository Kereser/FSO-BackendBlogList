const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const helper = require('./blog_helper')

const Blog = require('../models/blog')
const User = require('../models/user')


const api = supertest(app)

beforeEach( async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs.map(b => new Blog(b))
  const promiseArray = blogObjects.map(b => b.save()) 
  await Promise.all(promiseArray)
}, 20000)

describe('There is initial state for blogs', () => {
  test('correct blogs length returned', async () => {
    const blogsAtStart = await helper.blogsInDB()
  
    const result = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /json/)
  
    expect(result.body).toHaveLength(blogsAtStart.length)
  })
})

describe('Specific blog', () => {
  test('A nonExisting ID returns a status code of 404', async () => {
    const nonExistingId = await helper.nonExistingId()
    
    await api
      .get(`/api/blogs/${nonExistingId}`)
      .expect(404)
  })

  test('Updating likes of a specific note', async () => {
    const blogsAtStart = await helper.blogsInDB()
    const blogToUpdate = blogsAtStart[0]

    const newBlog = {
      likes: 1000
    }

    const result = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /json/)

    expect(result.body.likes).toBe(1000)
    expect(result.body.title).toBe(blogToUpdate.title)
  })  
})

describe('Verifying properties', () => {
  test('unique identifier property = id', async () => {
  
    const result = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /json/)
  
    const ids = result.body.map(b => b.id)
    expect(ids).toBeDefined()
  })
})

describe('Create blogs', () => {
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
})

describe('Post with missing content', () => {
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
  
    const notesAtEnd = await helper.blogsInDB()
    expect(notesAtEnd).toHaveLength(helper.initialBlogs.length)
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
  
    const notesAtEnd = await helper.blogsInDB()
    expect(notesAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('Deleting resources', () => {
  test('delete a note with existing ID', async () => {
    const blogsAtStart = await helper.blogsInDB()
    const initialBlog = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${initialBlog.id}`)
      .expect(204)
  })

  test('Status code 400 if id is malformatted', async () => {
    const nonValidId = '5a3d5da59070081a82a34'
    
    await api
      .delete(`/api/blogs/${nonValidId}`)
      .expect(400)
  })
})

describe('Adding users to db with initial data', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({username: 'root', passwordHash, name: 'shiki'})
    await user.save()
  })

  test('Adding one valid User', async () => {
    const newUser = {
      username: 'root2',
      password: 'sekret2',
      name: 'rootie2'
    }

    const result = await api 
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /json/)
    
    const userAtEnd = await helper.usersInDb()
    const usernames = userAtEnd.map(u => u.username)
    expect(usernames).toContain(result.body.username)
  })

  test('Adding a non unique username', async () => {
    const newUser = {
      username: 'root',
      password: 'sekret',
      name: 'rootie2'
    }

    const result = await api 
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain('Username already exist')
  })

  test('Adding a user with username: ro', async () => {
    const newUser = {
      username: 'ro',
      password: 'sekret',
      name: 'rootie2'
    }

    const result = await api 
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain("username 'ro'")
  })

  test('Adding a a user with less than 3 characters password', async () => {
    const newUser = {
      username: 'rooti',
      password: 'ws',
      name: 'rootie3'
    }

    const result = await api 
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain("Password doesn't meet the requirements")
  }) 
})


afterAll(() => {
  mongoose.connection.close()
})