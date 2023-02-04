import express from 'express'
import bodyParser from 'body-parser'
import { MongoClient } from 'mongodb'
import history from 'connect-history-api-fallback'
import path from 'path'

// Setup express
const app = express()
// Setup body-parser middleware to parse incoming request
app.use(bodyParser.json())
// Handle the project path
app.use('/images', express.static(path.join(__dirname, '../assets')))
app.use(
  express.static(path.resolve(__dirname, '../dist'), {
    maxAge: '1y',
    etag: false,
  })
)

// Create a GET route to retrieve the lessons data
app.get('/api/lessons', async (req, res) => {
  // Create a connection to the MongoDB server.
  const client = await MongoClient.connect(
    process.env.MONGO_PASS && process.env.MONGO_USER
      ? `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.htmifzd.mongodb.net/?retryWrites=true&w=majority`
      : 'mongodb://localhost:27017',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  const db = client.db(process.env.MONGO_DBNAME || 'lessons-db')

  /* 
     Find the lesson collection and loop through it and retrieve all of the lessons' data,
     then convert the data to an array.
  */
  const lessons = await db.collection('lessons').find({}).toArray()
  /*
     Return the data with the status code 200,
     which indicates that the server successfully returned the data.
  */
  res.status(200).json(lessons)
  // Close the database
  client.close()
})

// Create a GET route to retrieve the user data
app.get('/api/users', async (req, res) => {
  // Create a connection to the MongoDB server.
  const client = await MongoClient.connect(
    process.env.MONGO_PASS && process.env.MONGO_USER
      ? `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.htmifzd.mongodb.net/?retryWrites=true&w=majority`
      : 'mongodb://localhost:27017',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  const db = client.db(process.env.MONGO_DBNAME || 'lessons-db')
  // Find the users collection and retrieve the user data
  const user = await db.collection('users').find({}).toArray()
  // Check to see if the user exists in the database.
  if (!user) {
    res.status(404).json({
      msg: 'user not found!',
      success: false,
    })
  }
  /*
     Return the user data with the status code 200,
     which indicates that the server successfully returned the data.
  */
  res.status(200).json({ email: user[0].email, password: user[0].password })
  // Close the database
  client.close()
})

// Create a GET route to retrieve the user's cart data.
app.get('/api/users/:userName/cart', async (req, res) => {
  // Create a connection to the MongoDB server.
  const client = await MongoClient.connect(
    process.env.MONGO_PASS && process.env.MONGO_USER
      ? `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.htmifzd.mongodb.net/?retryWrites=true&w=majority`
      : 'mongodb://localhost:27017',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  const db = client.db(process.env.MONGO_DBNAME || 'lessons-db')
  // Find the users collection and search for the user using the userName parameter from the request.
  // and check to see if the user exists in the database.
  const user = await db
    .collection('users')
    .findOne({ username: req.params.userName })
  if (!user)
    return res.status(404).json({
      msg: 'user not found!',
      success: false,
    })

  // If we found the user:
  // - return the cart Items from the user collection
  // - return all the lessons collection
  // - loop on the cart Items array and received all of the lesson Ids
  // - return the lesson data that was saved in the cart item
  const cartItemIds = user.cartItems
  const lessons = await db.collection('lessons').find({}).toArray()
  const cartItems = cartItemIds.map(id =>
    lessons.find(lesson => lesson.lessonId === id)
  )
  res.status(200).json(cartItems)
  // Close the database
  client.close()
})

// Create a POST route to add the lessons to the cart.
app.post('/api/users/:userName/cart', async (req, res) => {
  // Retrieve the userName from the request parameters and the lessonId from the request body
  const { userName } = req.params
  const { lessonId } = req.body
  // Create a connection to the MongoDB server.
  const client = await MongoClient.connect(
    process.env.MONGO_PASS && process.env.MONGO_USER
      ? `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.htmifzd.mongodb.net/?retryWrites=true&w=majority`
      : 'mongodb://localhost:27017',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  const db = client.db(process.env.MONGO_DBNAME || 'lessons-db')
  // Find the lesson collection and loop through it and retrieve all of the lessons' data
  const lessons = await db.collection('lessons').find({}).toArray()

  // Find the user's collection and update the cart items and set a new lesson id to it
  await db.collection('users').updateOne(
    { username: userName },
    {
      $addToSet: { cartItems: lessonId },
    }
  )

  // Find the users collection and search for the user using the userName parameter from the request.
  const user = await db.collection('users').findOne({ username: userName })
  // received all of the lesson Ids
  const cartItemIds = user.cartItems
  // return all the lessons data that was saved in the cart item
  const cartItems = cartItemIds.map(id =>
    lessons.find(lesson => lesson.id === id)
  )
  res.status(200).json({
    msg: 'Added successfully to the shopping cart',
    success: true,
  })
  // Close the database
  client.close()
})

// Create a DELETE route to remove the lesson from the cart.
app.delete('/api/users/:userId/cart/:lessonId', async (req, res) => {
  // Retrieve the userId and the lessonId from the request parameters
  const { userId, lessonId } = req.params
  // Create a connection to the MongoDB server.
  const client = await MongoClient.connect(
    process.env.MONGO_PASS && process.env.MONGO_USER
      ? `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.htmifzd.mongodb.net/?retryWrites=true&w=majority`
      : 'mongodb://localhost:27017',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  const db = client.db(process.env.MONGO_DBNAME || 'lessons-db')
  // Find the lesson in the user's cart and remove it by its id.
  await db.collection('users').updateOne(
    { id: userId },
    {
      $pull: { cartItems: lessonId },
    }
  )
  // Find the users collection and search for the user using the userId parameter from the request.
  const user = await db.collection('users').findOne({ id: userId })
  // return all the lessons data
  const lessons = await db.collection('lessons').find({}).toArray()
  // received all of the lesson Ids
  const cartItemIds = user.cartItems
  // return all the lessons data that was saved in the cart item
  const cartItems = cartItemIds.map(id =>
    lessons.find(lesson => lesson.lessonId === id)
  )
  res.status(200).json(cartItems)
  client.close()
})

// Create a POST route to remove all the lessons from the cart
// when the user click to the checkout button we need to clear all lessons form the cart
app.post('/api/users/:userName/clear-cart', async (req, res) => {
  // Retrieve the userName and the lessonId from the request parameters
  const { userName, lessonId } = req.params
  // Create a connection to the MongoDB server.
  const client = await MongoClient.connect(
    process.env.MONGO_PASS && process.env.MONGO_USER
      ? `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.htmifzd.mongodb.net/?retryWrites=true&w=majority`
      : 'mongodb://localhost:27017',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  const db = client.db(process.env.MONGO_DBNAME || 'lessons-db')

  // Clear all cartItems data
  await db.collection('users').updateOne(
    { username: userName },
    {
      $set: { cartItems: [] },
    }
  )
  res.status(200).json('clear all cart')

  // Close the database
  client.close()
})

// Create a POST route to user login
app.post('/api/login', async (req, res) => {
  // Retrieve the email and the password from the request body
  const { email, password } = req.body
  // Create a connection to the MongoDB server.
  const client = await MongoClient.connect(
    process.env.MONGO_PASS && process.env.MONGO_USER
      ? `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.htmifzd.mongodb.net/?retryWrites=true&w=majority`
      : 'mongodb://localhost:27017',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  const db = client.db(process.env.MONGO_DBNAME || 'lessons-db')

  // Check to see if the user's email address exists.
  const user = await db.collection('users').findOne({ email: email })
  if (!user) {
    return res.status(404).json({
      msg: 'user not found',
      success: false,
    })
  }

  // Check for password and send the success or faild message
  if (password === user.password) {
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
  // Close the database
  client.close()
})

// setup frontend with backend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

// Run the Exprees server
app.listen(process.env.PORT || 8000, () => {
  console.log('Server is listinging at port 8000')
})
