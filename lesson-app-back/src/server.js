import express from 'express'
import bodyParser from 'body-parser'
import { MongoClient } from 'mongodb'

const app = express()
app.use(bodyParser.json())

// GET Lessons List
app.get('/api/lessons', async (req, res) => {
  const client = await MongoClient.connect('mongodb://localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  const db = client.db('lessons-db')
  const lessons = await db.collection('lessons').find({}).toArray()
  res.status(200).json(lessons)
  client.close()
})

// GET users data
app.get('/api/users/:userId', async (req, res) => {
  const { userId } = req.params
  const client = await MongoClient.connect('mongodb://localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  const db = client.db('lessons-db')
  const user = await db.collection('users').findOne({ id: userId })
  if (!user) {
    res.status(404).json('user not found!')
  }
  res.status(200).json(user)
  client.close()
})

// GET User cart
app.get('/api/users/:userId/cart', async (req, res) => {
  const client = await MongoClient.connect('mongodb://localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  const db = client.db('lessons-db')
  const user = await db.collection('users').findOne({ id: req.params.userId })
  if (!user) return res.status(404).json('user not found!')

  const lessons = await db.collection('lessons').find({}).toArray()
  const cartItemIds = user.cartItems
  const cartItems = cartItemIds.map(id =>
    lessons.find(lesson => lesson.id === id)
  )
  res.status(200).json(cartItems)
  client.close()
})

// Add lesson to the cart
app.post('/api/users/:userId/cart', async (req, res) => {
  const { userId } = req.params
  const { lessonId } = req.body
  const client = await MongoClient.connect('mongodb://localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  const db = client.db('lessons-db')

  await db.collection('users').updateOne(
    { id: userId },
    {
      $addToSet: { cartItems: lessonId },
    }
  )

  const user = await db.collection('users').findOne({ id: userId })
  const cartItemIds = user.cartItems
  const cartItems = cartItemIds.map(id =>
    lessons.find(lesson => lesson.id === id)
  )
  res.status(200).json(cartItems)
  client.close()
})

// Remove lesson from the cart
app.delete('/api/users/:userId/cart/:lessonId', async (req, res) => {
  const { userId, lessonId } = req.params
  const client = await MongoClient.connect('mongodb://localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  const db = client.db('lessons-db')

  await db.collection('users').updateOne(
    { id: userId },
    {
      $pull: { cartItems: lessonId },
    }
  )

  const user = await db.collection('users').findOne({ id: userId })
  const lessons = await db.collection('lessons').find({}).toArray()
  const cartItemIds = user.cartItems
  const cartItems = cartItemIds.map(id =>
    lessons.find(lesson => lesson.id === id)
  )

  res.status(200).json(cartItems)
  client.close()
})

app.listen(8000, () => {
  console.log('Server is listinging at port 8000')
})
