const express = require('express')
const path = require('path')
const mysql = require('mysql')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')

dotenv.config({ path: './.env' })

const app = express()

const db = mysql.createConnection({
  host: process.env
    .MYSQL_HOST /* Substituir localhost e colocar o ID Dress do Hiroku para rodar api na nuvem*/,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
})

const publicicDirectory = path.join(__dirname, './public')
app.use(express.static(publicicDirectory))
//Docodifica mesnsagens enviadas no corpo das requisições
app.use(express.urlencoded({ extended: false }))
//enviar e receber JSON
app.use(express.json())
app.use(cookieParser())

app.set('view engine', 'hbs')

db.connect(error => {
  if (error) {
    console.log(error)
  } else {
    console.log('MYSQL Connected...')
  }
})

//Routes
app.use('/', require('./routes/pages'))
app.use('/auth', require('./routes/auth'))

app.listen(5000, () => {
  console.log('Server started on Port 5000')
})
