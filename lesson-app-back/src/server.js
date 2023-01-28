import express from 'express'
import bodyParser from 'body-parser'
import { MongoClient } from 'mongodb'

const lessons = [
  {
    id: '001',
    topic: 'Algebra',
    location: 'London',
    price: 200,
    image:
      'https://therealschool.in/blog/wp-content/uploads/2021/06/algebra-games-for-kids-1.jpg',
    icon: 'fa-solid fa-square-root-variable',
  },
  {
    id: '002',
    topic: 'Arithmetic',
    location: 'York',
    price: 150,
    image:
      'https://www.mathplanet.com/media/2439951/digitalamatte.png?width=500&height=333.3333333333333',
    icon: 'fa-solid fa-calculator',
  },
  {
    id: '003',
    topic: 'Geometry',
    location: 'London',
    price: 550,
    image:
      'https://d2r55xnwy6nx47.cloudfront.net/uploads/2022/11/NovemberAcademy-cr.RobertNeubecker-Lede-scaled.webp',
    icon: 'fa-solid fa-shapes',
  },
  {
    id: '004',
    topic: 'Calculus',
    location: 'Halton',
    price: 350,
    image: 'https://s3.amazonaws.com/campus.reform/17472/7dkibmcalculus.jpeg',
    icon: 'fa-solid fa-divide',
  },
  {
    id: '005',
    topic: 'Analysis',
    location: 'York',
    price: 100,
    image:
      'https://images.ctfassets.net/lh3zuq09vnm2/6ETyYNfs3khwXxNtEmmxeN/9fb43476bf6538952b83b72df2da02bd/Website_Analysis.png',
    icon: 'fa-solid fa-chart-pie',
  },
  {
    id: '006',
    topic: 'Science',
    location: 'London',
    price: 850,
    image:
      'https://img.freepik.com/free-vector/hand-drawn-science-education-background_23-2148499325.jpg',
    icon: 'fa-solid fa-microscope',
  },
  {
    id: '007',
    topic: 'Physics',
    location: 'York',
    price: 700,
    image:
      'https://images.theconversation.com/files/191827/original/file-20171025-25516-g7rtyl.jpg?ixlib=rb-1.1.0&rect=0%2C70%2C7875%2C5667&q=45&auto=format&w=926&fit=clip',
    icon: 'fa-brands fa-codepen',
  },
  {
    id: '008',
    topic: 'Chemistry',
    location: 'Halton',
    price: 400,
    image:
      'https://facts.net/wp-content/uploads/2020/03/chemistry-facts-1024x509.jpg',
    icon: 'fa-solid fa-flask-vial',
  },
  {
    id: '009',
    topic: 'Biology',
    location: 'London',
    price: 500,
    image:
      'https://www.ncl.ac.uk/mediav8/natural-and-environmental-sciences/images/chemical-biology-hero.jpg',
    icon: 'fa-solid fa-dna',
  },
  {
    id: '010',
    topic: 'History',
    location: 'Halton',
    price: 250,
    image:
      'https://www.thebritishacademy.ac.uk//media/images/March-of-Intellect-1828-William-H.e1dfd90c.fill-1200x675.jpg',
    icon: 'fa-solid fa-landmark-dome',
  },
  {
    id: '011',
    topic: 'Python',
    location: 'York',
    price: 600,
    image:
      'https://thewriteress.com/wp-content/uploads/2021/01/Learn-Python-in-Arabic.jpg',
    icon: 'fa-brands fa-python',
  },
  {
    id: '012',
    topic: 'Java',
    location: 'Halton',
    price: 300,
    image:
      'https://www.chawtechsolutions.com/wp-content/uploads/2020/10/java_binary.jpg',
    icon: 'fa-brands fa-java',
  },
]

let cartItems = [lessons[0], lessons[2], lessons[3]]

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
