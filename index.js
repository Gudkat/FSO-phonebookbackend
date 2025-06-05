require('dotenv').config
const express = require('express')
const PhonebookEntry = require('./models/phonebookEntry')
const app = express()
const morgan = require('morgan')

  
app.use(express.json())
app.use(express.static('dist')) 

morgan.token('content', (reqest, response) => JSON.stringify(reqest.body))
app.use(morgan(':method :url :status :res[content-length] :response-time ms :content'))

app.get('/api/persons', (request, response) => {
  PhonebookEntry.find({}).then((results) =>
    response.json(results)
  )
})

app.get('api/info', (request, response) => {
  const date = new Date()
  const info = `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`
  response.send(info)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  PhonebookEntry.findById(id)
  .then((person) => {
    if (!person) {
      return response.status(204).end()
    }
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  console.log(id)
  PhonebookEntry.findByIdAndDelete(id)
  .then((result) => {
    response.status(204).end()
  })
  .catch((error) => console.error(error.message))
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  PhonebookEntry.find({}).then(persons => {

    
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
    
    const pbEntry = new PhonebookEntry({
      name: body.name,
      number: body.number,
    })
    
    pbEntry.save().then((newEntry) => {
      response.json(newEntry)
    })
  })
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
