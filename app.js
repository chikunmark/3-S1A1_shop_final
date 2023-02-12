// 如果環境不是 production，就引入 dotenv 套件，但我都查不到 process.env.NODE_ENV 的資料...
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const session = require('express-session') //！！查他的大概用處
const app = express()
const port = process.env.PORT
const exphbs = require('express-handlebars')
const flash = require('connect-flash') //！！查他的大概用處 (課程應該有)
const usePassport = require('./config/passport')

///////// 為使用 put, delete method，引入、使用 methodOverride (套件) ////////
const methodOverride = require('method-override')
// 設定每一筆請求都會透過 methodOverride 進行前置處理
// P.S. 好像得擺在 bodyParser 之後，先擺這試試，看會怎樣
app.use(methodOverride('_method'))
// (上1) _method 是參數，也能改成其他字，代表一遇到 '' 內的字，就會將 HTTP method 換成 _method 的值 (例： ?_method=delete，form 裡面的 HTTP method 就會換成 delete)

require('./config/mongoose') // 引用 mongoose 與相關設定，反正不論如何都要引用，且輸入的 code 中，只用這一次，所以不設變數了

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
)

app.use(express.static('public'))
// 只知道是導入 public 資料夾，導入 JS, CSS 等，但裡面的 static 到底是啥意呢？
app.use(express.urlencoded({ extended: true })) // 藉 express 內建的 body parser 分析 post 內容

usePassport(app) //！！課程把它擺這，我還沒想到原因 (應該不用先 run 過這些程式碼才對啊？)
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

const routes = require('./routes/index') // 可不寫 /index，因為預設會去找它
app.use(routes)
// (上1) 所有的路由
// 以 routes 為參數，使用 app (express) 這個套件 (導入 index.js 的路由)

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})
