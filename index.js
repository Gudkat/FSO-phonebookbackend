const express = require('express')
const PhonebookEntry = require('./models/phonebookEntry')
const app = express()
const morgan = require('morgan')

  
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
app.use(express.static('dist')) 

morgan.token('content', (reqest, response) => JSON.stringify(reqest.body))
app.use(morgan(':method :url :status :res[content-length] :response-time ms :content'))


app.get('/api/persons', (request, response) => {
  PhonebookEntry.find({}).then((results) =>
    response.json(results)
)
})

app.get('/api/info', (request, response) => {
  const date = new Date()
  PhonebookEntry.find({}).then((persons) => {
    const info = `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`
    response.send(info)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  PhonebookEntry.findById(id)
  .then((person) => {
    if (person) {
      response.json(person)
    } else {
      return response.status(204).end()
    }
  })
  .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  PhonebookEntry.findByIdAndDelete(id)
  .then((result) => {
    response.status(204).end()
    // The example program didn't have any error handling for the corresponding method so I assume it was not required. If it was I'm not sure what was. 
    // the .catch((error) => next(error)) at least doesn't do anything
  })
  // .catch((error) => next(error))
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

app.put('/api/persons/:id', (request, response, next) => {
  const id =  request.params.id
  const { number } = request.body

  PhonebookEntry.findByIdAndUpdate(
    id,
    { number: number },
    { new: true }
  )
    .then((updatedPerson) => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        return response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
