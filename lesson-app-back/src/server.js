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

// GET user data
app.get('/api/users', async (req, res) => {
  // const { userName } = req.params
  const client = await MongoClient.connect('mongodb://localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  const db = client.db('lessons-db')
  const user = await db.collection('users').find({}).toArray()
  if (!user) {
    res.status(404).json({
      msg: 'user not found!',
      success: false,
    })
  }
  res.status(200).json({ email: user[0].email, passowrd: user[0].passowrd })
  client.close()
})

// GET User cart
app.get('/api/users/:userName/cart', async (req, res) => {
  const client = await MongoClient.connect('mongodb://localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  const db = client.db('lessons-db')
  const user = await db
    .collection('users')
    .findOne({ username: req.params.userName })
  if (!user)
    return res.status(404).json({
      msg: 'user not found!',
      success: false,
    })

  const lessons = await db.collection('lessons').find({}).toArray()
  const cartItemIds = user.cartItems
  const cartItems = cartItemIds.map(id =>
    lessons.find(lesson => lesson.lessonId === id)
  )
  res.status(200).json(cartItems)
  client.close()
})

// Add lesson to the cart
app.post('/api/users/:userName/cart', async (req, res) => {
  const { userName } = req.params
  const { lessonId } = req.body
  const client = await MongoClient.connect('mongodb://localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  const db = client.db('lessons-db')
  const lessons = await db.collection('lessons').find({}).toArray()

  await db.collection('users').updateOne(
    { username: userName },
    {
      $addToSet: { cartItems: lessonId },
    }
  )

  const user = await db.collection('users').findOne({ username: userName })
  const cartItemIds = user.cartItems
  const cartItems = cartItemIds.map(id =>
    lessons.find(lesson => lesson.id === id)
  )
  res.status(200).json({
    msg: 'Added successfully to the shopping cart',
    success: true,
  })
  client.close()
})

// Remove lesson from the cart
app.delete('/api/users/:userName/cart/:lessonId', async (req, res) => {
  const { userName, lessonId } = req.params
  const client = await MongoClient.connect('mongodb://localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  const db = client.db('lessons-db')

  await db.collection('users').updateOne(
    { username: userName },
    {
      $pull: { cartItems: lessonId },
    }
  )

  const user = await db.collection('users').findOne({ username: userName })
  const lessons = await db.collection('lessons').find({}).toArray()
  const cartItemIds = user.cartItems
  const cartItems = cartItemIds.map(id =>
    lessons.find(lesson => lesson.lessonId === id)
  )

  res.status(200).json(cartItems)
  client.close()
})

// Clear all lessons after checkout
app.post('/api/users/:userName/clear-cart', async (req, res) => {
  const { userName, lessonId } = req.params
  const client = await MongoClient.connect('mongodb://localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  const db = client.db('lessons-db')

  await db.collection('users').updateOne(
    { username: userName },
    {
      $set: { cartItems: [] },
    }
  )
  res.status(200).json('clear all cart')
  client.close()
})

// Login to account
app.post('/api/login', async (req, res) => {
  const { email, passowrd } = req.body

  const client = await MongoClient.connect('mongodb://localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  const db = client.db('lessons-db')

  const user = await db.collection('users').findOne({ email: email })
  if (!user) {
    return res.status(404).json({
      msg: 'user not found',
      success: false,
    })
  }

  // Check for password
  if (passowrd === user.passowrd) {
    res.status(200).json({
      msg: 'You are now logged in',
      success: true,
    })
  } else {
    return res.status(404).json({
      msg: 'Incorrect password',
      success: false,
    })
  }

  client.close()
})

app.listen(8000, () => {
  console.log('Server is listinging at port 8000')
})
