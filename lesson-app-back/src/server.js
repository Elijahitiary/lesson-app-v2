import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.send('Lesson App')
})

app.listen(8000, () => {
  console.log('Server is listinging at port 8000')
})
