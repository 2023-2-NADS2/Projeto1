const express = require('express')
const authController = require('../controllers/auth')

const router = express.Router()

router.get('/', authController.isLoggedIn, (req, res) => {
  res.render('index', {
    user: req.user
  })
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/profile', authController.isLoggedIn, (req, res) => {
res.render('profile')

  //   if (req.user) {
//     res.render('profile', {
//       user: req.user
//     })
//   } else {
//     res.redirect('/login')
//   }
})

router.get('/gallery', authController.isLoggedIn, (req, res) => {
  res.render('gallery', {
    user: req.user
  })
})

router.get('/contato', authController.isLoggedIn, (req, res) => {
  res.render('contato', {
    user: req.user
  })
})
router.get('/donation', authController.isLoggedIn, (req, res) => {
  res.render('donation', {
    user: req.user
  })
})
router.get('/donationPagamento', authController.isLoggedIn, (req, res) => {
  res.render('donationPagamento', {
    user: req.user
  })
})

router.get('/termosDeUso', authController.isLoggedIn, (req, res) => {
  res.render('termosDeUso', {
    user: req.user
  })
})

router.get('/privacidade', authController.isLoggedIn, (req, res) => {
  res.render('privacidade', {
    user: req.user
  })
})

module.exports = router
