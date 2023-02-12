const express = require('express')
const router = express.Router()
const { authenticator } = require('../middleware/auth')

// (下1) 引用 home.js (教案說引入 home 模組程式碼，差別在哪？)
const home = require('./modules/home')
const shops = require('./modules/shops')
const FBauth = require('./modules/auth')
const users = require('./modules/users')

router.use('/users', users)
router.use('/auth', FBauth)
// (下1) 使用 router 這個變數：
// 遇到 '/' 這個路徑，就導入 home (這寫法跟 app.get 這種 listening 的機制頗像)
// router.use('/', home)
router.use('/', authenticator, home)
// (下1) 自己試的：猜想意思，不論如何，就使用 shops 這個變數 (結論上成功)
// 因為裡面路由細節太亂，就不額外加條件了 (有點偷懶)
// router.use(shops)
router.use(authenticator, shops)

// 把結果匯出路由器，雖不知為何不能寫成 module.exports = express.Router()
module.exports = router
