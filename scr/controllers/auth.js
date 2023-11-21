const mysql = require('mysql')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { promisify } = require('util')

const db = mysql.createConnection({
  host: process.env
    .MYSQL_HOST /* Substituir localhost e colocar o ID Dress do Hiroku para rodar api na nuvem*/,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
})

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).render('login', {
        message: 'Por favor, inserir um email e/ou senha válidos'
      })
    }

    db.query(
      'SELECT * FROM users WHERE email = ?',
      [email],
      async (error, results) => {
        console.log(results)

        if (
          !results ||
          !(await bcrypt.compare(password, results[0].password))
        ) {
          res.status(401).render('login', {
            message: 'Email ou senha incorretos'
          })
        } else {
          const id = results[0].id
          const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
          })

          console.log('The token is: ' + token)

          const cookieOptions = {
            expires: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true
          }
          res.cookie('jwt', token, cookieOptions)
          res.status(200).redirect('/profile')
        }
      }
    )
  } catch (error) {
    console.log(error)
  }
}

exports.register = (req, res) => {
  console.log(req.body)

  const { name, email, password, passwordConfirm } = req.body

  db.query(
    'SELECT email FROM users WHERE email = ?',
    [email],
    async (error, results) => {
      if (error) {
        console.log(error)
      }

      if (results.length > 0) {
        return res.render('register', {
          message: 'Esse usuário já existe, por favor use outro email'
        })
      } else if (password !== passwordConfirm) {
        return res.render('register', {
          message: 'Senhas divergentes, por favor, tente novamente'
        })
      }

      let hashedPassword = await bcrypt.hash(password, 8)
      console.log(hashedPassword)

      db.query(
        'INSERT INTO users SET ?',
        {
          name: name,
          email: email,
          password: hashedPassword
        },
        (error, results) => {
          if (error) {
            console.log(error)
          } else {
            console.log(results)
            return res.render('register', {
              message: 'Usuário cadastrado'
            })
          }
        }
      )
    }
  )
}

exports.isLoggedIn = async (req, res, next) => {
  //console.log(req.cookies)
  if (req.cookies.jwt) {
    try {
      //Verify Token is ok
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      )
      console.log(decoded)

      //Check if the user still exists
      db.query(
        'SELECT * FROM users WHERE id = ?',
        [decoded.id],
        (error, result) => {
          console.log(result)
          if (!result) {
            return next()
          }

          req.user = result[0]
          console.log(error)
          return next()
        }
      )
    } catch (error) {}
  } else {
    next()
  }
}

exports.logout = async (req, res) => {
  res.cookie('jwt', 'logout', {
    expires: new Date(Date.now() + 2),
    httpOnly: true
  })

  res.status(200).redirect('/')
}
