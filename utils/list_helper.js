const _ = require('lodash')


const dummy = (blogs) => {
  if (Array.isArray(blogs)) {
    return 1
  }
}

const totalLikes = (listOfBlogs) => {
  if (Array.isArray(listOfBlogs)) {
    if (listOfBlogs.length === 0) {
      return 0
    }
    else if (listOfBlogs.length === 1) {
      const [obj] = listOfBlogs
      return obj.likes
    }
    else {
      return listOfBlogs.map(blog => {
        return blog.likes
      }).reduce((acc, curr) => {
        return acc + curr
      }, 0)
    }
  }
}

const favoriteBlog = (blogs) => {
  if (Array.isArray(blogs)) {
    return blogs
      .map(blog => ({
        ['title']: blog.title,
        ['author']: blog.author,
        ['likes']: blog.likes
      }))
      .reduce((acc, el) => {
        if (acc.likes > el.likes) {
          return acc
        }
        return el
      })
  }
}

const mostBlogs = (blogs) => {
  if (Array.isArray(blogs)) {

    const mapFunc = (val, key) => {
      return ({
        author: key,
        blogs: val
      })
    }

    return _.map(_.countBy(blogs, 'author'), mapFunc)
      .reduce((acc, el) => {
        if (acc.blogs > el.blogs) {
          return acc
        }
        else {
          return el
        }
      })
  }
}

const mostLikes = (blogs) => {
  const mapFunction = (val, key) => {
    return ({
      author: key,
      likes: val.reduce((acc, el) => {
        return acc + el.likes
      }, 0)
    })
  }

  const result = _.groupBy(blogs, 'author')

  return _.map(result, mapFunction)
    .reduce((acc, el) => {
      if (acc.likes > el.likes) {
        return acc
      }
      return el
    })
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}