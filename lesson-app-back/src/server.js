import express from 'express'
import bodyParser from 'body-parser'

const lessons = [
  {
    id: '1',
    subject: 'Algebra',
    location: 'London',
    price: 200,
    image:
      'https://therealschool.in/blog/wp-content/uploads/2021/06/algebra-games-for-kids-1.jpg',
    icon: 'fa-solid fa-square-root-variable',
    space: 5,
  },
  {
    id: '2',
    subject: 'Arithmetic',
    location: 'York',
    price: 150,
    image:
      'https://www.mathplanet.com/media/2439951/digitalamatte.png?width=500&height=333.3333333333333',
    icon: 'fa-solid fa-calculator',
    space: 5,
  },
  {
    id: '3',
    subject: 'Geometry',
    location: 'London',
    price: 550,
    image:
      'https://d2r55xnwy6nx47.cloudfront.net/uploads/2022/11/NovemberAcademy-cr.RobertNeubecker-Lede-scaled.webp',
    icon: 'fa-solid fa-shapes',
    space: 5,
  },
  {
    id: '4',
    subject: 'Calculus',
    location: 'Halton',
    price: 350,
    image: 'https://s3.amazonaws.com/campus.reform/17472/7dkibmcalculus.jpeg',
    icon: 'fa-solid fa-divide',
    space: 5,
  },
  {
    id: '5',
    subject: 'Analysis',
    location: 'York',
    price: 100,
    image:
      'https://images.ctfassets.net/lh3zuq09vnm2/6ETyYNfs3khwXxNtEmmxeN/9fb43476bf6538952b83b72df2da02bd/Website_Analysis.png',
    icon: 'fa-solid fa-chart-pie',
    space: 5,
  },
  {
    id: '6',
    subject: 'Science',
    location: 'London',
    price: 850,
    image:
      'https://img.freepik.com/free-vector/hand-drawn-science-education-background_23-2148499325.jpg',
    icon: 'fa-solid fa-microscope',
    space: 5,
  },
  {
    id: '7',
    subject: 'Physics',
    location: 'York',
    price: 700,
    image:
      'https://images.theconversation.com/files/191827/original/file-20171025-25516-g7rtyl.jpg?ixlib=rb-1.1.0&rect=0%2C70%2C7875%2C5667&q=45&auto=format&w=926&fit=clip',
    icon: 'fa-brands fa-codepen',
    space: 5,
  },
  {
    id: '8',
    subject: 'Chemistry',
    location: 'Halton',
    price: 400,
    image:
      'https://facts.net/wp-content/uploads/2020/03/chemistry-facts-1024x509.jpg',
    icon: 'fa-solid fa-flask-vial',
    space: 5,
  },
  {
    id: '9',
    subject: 'Biology',
    location: 'London',
    price: 500,
    image:
      'https://www.ncl.ac.uk/mediav8/natural-and-environmental-sciences/images/chemical-biology-hero.jpg',
    icon: 'fa-solid fa-dna',
    space: 5,
  },
  {
    id: '10',
    subject: 'History',
    location: 'Halton',
    price: 250,
    image:
      'https://www.thebritishacademy.ac.uk//media/images/March-of-Intellect-1828-William-H.e1dfd90c.fill-1200x675.jpg',
    icon: 'fa-solid fa-landmark-dome',
    space: 5,
  },
  {
    id: '11',
    subject: 'Python',
    location: 'York',
    price: 600,
    image:
      'https://thewriteress.com/wp-content/uploads/2021/01/Learn-Python-in-Arabic.jpg',
    icon: 'fa-brands fa-python',
    space: 5,
  },
  {
    id: '12',
    subject: 'Java',
    location: 'Halton',
    price: 300,
    image:
      'https://www.chawtechsolutions.com/wp-content/uploads/2020/10/java_binary.jpg',
    icon: 'fa-brands fa-java',
    space: 5,
  },
]

let cartItems = [lessons[0], lessons[2], lessons[3]]

const app = express()
app.use(bodyParser.json())

// GET Lessons List
app.get('/api/lessons', (req, res) => {
  res.status(200).json(lessons)
})

// GET User cart
app.get('/api/users/:userId/cart', (req, res) => {
  res.status(200).json(cartItems)
})

// Add lesson to the cart
app.post('/api/users/:userId/cart', (req, res) => {
  const { lessonId } = req.body
  const lesson = lessons.find(lesson => lesson.id === lessonId)
  if (lesson) {
    cartItems.push(lesson)
    res.status(200).json(cartItems)
  } else {
    res.status(404).json('product not found')
  }
})

// Remove lesson from the cart
app.delete('/api/users/:userId/cart/:lessonId', (req, res) => {
  const { lessonId } = req.params
  cartItems = cartItems.filter(lesson => lesson.id != lessonId)
  res.status(200).json(cartItems)
})

app.listen(8000, () => {
  console.log('Server is listinging at port 8000')
})
