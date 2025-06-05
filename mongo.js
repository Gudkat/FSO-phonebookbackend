const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://gudkat:${password}@cluster0.j4v5dy3.mongodb.net/PhoneBook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)
console.log('connecting to', url)

mongoose.connect(url)

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const PhonebookEntry = mongoose.model('PhonebookEntry', phoneBookSchema)

if (process.argv.length == 3) {
  PhonebookEntry.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(entry => {
      console.log(`${entry.name} ${entry.number}`)
    })
    mongoose.connection.close()
    
  })} else if (process.argv.length == 5) {
  const name = process.argv[3]
  const number = process.argv[4]
  
  const pbEntry = new PhonebookEntry({
    name: name,
    number: number,
  })
  
  pbEntry.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('wrong number or args given.')
  mongoose.connection.close()
}