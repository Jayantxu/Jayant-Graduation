const mongoose = require('mongoose')
const heroSchema = mongoose.Schema({
  name: String,
  age: String,
  sex: String,
  address: String,
  dowhat: String,
  imgArr: [],
  favourite: String,
  explain: String
}, {
  collection: 'myhero'
})
//  第二个参数是明确在数据库中哪个表中取数据
const Hero = module.exports = mongoose.model('hero', heroSchema)
