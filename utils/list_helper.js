

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
      const [obj]  = listOfBlogs 
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

module.exports = {
  dummy,
  totalLikes
}