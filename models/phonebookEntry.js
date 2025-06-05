const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)
console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

phoneBookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// const PhonebookEntry = mongoose.model('PhonebookEntry', phoneBookSchema)

// if (process.argv.length == 3) {
//   PhonebookEntry.find({}).then(result => {
//     console.log('phonebook:')
//     result.forEach(entry => {
//       console.log(`${entry.name} ${entry.number}`)
//     })
//     mongoose.connection.close()
    
//   })} else if (process.argv.length == 5) {
//   const name = process.argv[3]
//   const number = process.argv[4]
  
//   const pbEntry = new PhonebookEntry({
//     name: name,
//     number: number,
//   })
  
//   pbEntry.save().then(result => {
//     console.log(`added ${name} number ${number} to phonebook`)
//     mongoose.connection.close()
//   })
// } else {
//   console.log('wrong number or args given.')
//   mongoose.connection.close()
// }

module.exports = mongoose.model('PhonebookEntry', phoneBookSchema)
