const express = require('express')
const router = express.Router()

const passport = require('passport')
const bcrypt = require('bcryptjs')

const User = require('../../models/user')

router.get('/login', (req, res) => {
  const cssName = 'index'
  res.render('login', { cssName })
})

router.post('/login', (req, res) => {
  res.redirect('/')
})
// passport.authenticate('local', {
//   successRedirect: '/',
//   failureRedirect: '/users/login',
// })

router.get('/register', (req, res) => {
  const cssName = 'index'
  res.render('register', { cssName })
})

router.post('/register', (req, res) => {
  const { name, email, pw, confirmPW } = req.body
  const errors = []

  if (!name || !email || !pw || !confirmPW) {
    errors.push({ message: '所有欄位皆為必填' })
  }
  if (pw !== confirmPW) {
    errors.push({ message: '密碼與確認密碼不同。' })
  }
  if (errors.length) {
    return res.render('register', { errors, name, email, pw, confirmPW })
  }

  User.findOne({ email }).then(user => {
    if (user) {
      errors.push({ message: '此 email 已被註冊' })
      return res.render('register', { errors, name, email, pw, confirmPW })
    }

    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(pw, salt))
      .then(hash => User.create({ name, email, pw: hash }))
      .then(() => res.redirect('/users/login'))
      .catch(err => console.log(err))
  })
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '您已成功登出')
  res.redirect('/users/login')
})

module.exports = router
