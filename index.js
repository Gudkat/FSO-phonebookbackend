const express = require('express')
const app = express()
const morgan = require('morgan')
// var?

let persons = [
        { 
          "id": "1",
          "name": "Arto Hellas", 
          "number": "040-123456"
        },
        { 
          "id": "2",
          "name": "Ada Lovelace", 
          "number": "39-44-5323523"
        },
        { 
          "id": "3",
          "name": "Dan Abramov", 
          "number": "12-43-234345"
        },
        { 
          "id": "4",
          "name": "Mary Poppendieck", 
          "number": "39-23-6423122"
        }
    ]

app.use(express.json())

morgan.token('content', (reqest, response) => JSON.stringify(reqest.body))
app.use(morgan(':method :url :status :res[content-length] :response-time ms :content'))

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const date = new Date()
  const info = `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`
  response.send(info)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find((person) => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter((note) => note.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {

  const id = getRandomIntInclusive(1, 10000)
  const body = request.body


  if (!body.name || body.name.trim() === '') {
    return response.status(400).json({
      error: 'name is missing'
    })
  }

  if (!body.number || body.number.trim() === '') {
    return response.status(400).json({
      error: 'number is missing'
    })
  }

  const nameAlreadyUsed = persons.find((person) => person.name === body.name)

  if (nameAlreadyUsed) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }


  const person = {
    name: body.name,
    number: body.number,
    id: id
  }

  persons = persons.concat(person)

  response.json(person)
})

const getRandomIntInclusive = (min, max) => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled).toString(); 
  // based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
}


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
