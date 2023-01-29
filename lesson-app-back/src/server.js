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
app.get('/api/users/:userName', async (req, res) => {
  const { userName } = req.params
  const client = await MongoClient.connect('mongodb://localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  const db = client.db('lessons-db')
  const user = await db.collection('users').findOne({ username: userName })
  if (!user) {
    res.status(404).json({
      msg: 'user not found!',
      success: false,
    })
  }
  res.status(200).json(user)
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
    lessons.find(lesson => lesson.id === id)
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
    msg: cartItems,
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
    lessons.find(lesson => lesson.id === id)
  )

  res.status(200).json({
    msg: cartItems,
    success: true,
  })
  client.close()
})

// Register new user
app.post('/api/register', async (req, res) => {
  const { email, username, passowrd, confirm_password } = req.body

  const client = await MongoClient.connect('mongodb://localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  const db = client.db('lessons-db')

  if (passowrd != confirm_password) {
    return res.status(400).json({
      msg: 'Password do not match!',
      success: false,
    })
  }

  // Check is email alredy exist
  const userEmail = await db.collection('users').findOne({ email: email })
  if (userEmail) {
    return res.status(400).json({
      msg: 'Email already exists, please login',
      success: false,
    })
  }

  // Check is username alredy exist
  const userName = await db.collection('users').findOne({ username: username })
  if (userName) {
    return res.status(400).json({
      msg: 'Username already exists, try another one',
      success: false,
    })
  }

  await db.collection('users').insertOne({
    email: email,
    passowrd: passowrd,
    confirm_password: confirm_password,
    username: username,
    cartItems: [],
  })

  res.status(200).json({
    msg: 'Successfully registered',
    success: true,
  })
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
