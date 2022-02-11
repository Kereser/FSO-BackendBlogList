const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: "Locing in the air",
    author: "Ramusco",
    url: "http:/loving.com.co",
    likes: 403
  },
  {
    title: "Harry Potter",
    author: "unknown",
    url: "http://Harry.com.co",
    likes: 200
  },
  {
    title: "GOT",
    author: "Romiski",
    url: "http://GOT.com.co",
    likes: 1000
  }
]

const blogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const nonExistingId = async () => {
  const blog = new Blog({
    title: "Gotttik",
    author: "Romiski",
    url: "http://gotshki.com.es",
    likes: 1
  })

  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

module.exports = {
  blogsInDB,
  initialBlogs,
  nonExistingId
}