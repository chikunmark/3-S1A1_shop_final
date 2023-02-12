const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FBStrategy = require('passport-facebook').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  // 一般登入驗證
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, pw, done) => {
      User.findOne({ email })
        .then(user => {
          if (!user) {
            return done(null, false, { message: '此 email 未註冊' })
          }
          return bcrypt.compare(pw, user.pw).then(isMatch => {
            if (!isMatch) {
              return done(null, false, { message: 'email 或密碼不正確' })
            }
            return done(null, user)
          })
        })
        .catch(err => done(err, false))
    })
  )

  // 用FB登入，啟用程序 (看起來像，畢竟有 User.create，我原以為是驗證)
  passport.use(
    new FBStrategy(
      {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ['email', 'displayName'],
      },
      (accessToken, refreshToken, profile, done) => {
        const { name, email } = profile._json
        User.findOne({ email }).then(user => {
          if (user) return done(null, user)

          // 既然是登入驗證，為何要再做個密碼??
          // (下1) 用 random() 做一個小於一的隨機數、tostring，然後再從尾端曲八個值做密碼
          const randomPW = Math.random().toString(36).slice(-8)

          // 使用 bcrypt 把密碼雜湊，然後建立
          bcrypt
            .genSalt(10)
            .then(salt => bcrypt.hash(randomPW, salt))
            .then(hash => User.create({ name, email, pw: hash }))
            .then(user => done(null, user))
            .catch(err => done(err, false))
        })
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id) // 在 mongoose 裡，id 就是 _id
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}
