const bodyParser = require('body-parser')
const formidable = require('express-formidable')


const express = require('express')
const app = express()

app.use(bodyParser.json());

const router = express.Router()
router.use(formidable())

app.use('/router', router);

console.log(app._router.stack)

const run = async () => {
  // const mongooseConnection = await mongoose.connect(process.env.MONGO_URL)
  app.listen(8080, () => console.log('AdminBro is under localhost:8080/admin'))
}

run()
