const db = require('../../config/mongoose')
// (上1) 教案說，這是接收該路徑 export 出來，取名為 db 的資料
// 查過後，應這樣說，把該路徑 export 出來的資料，定義為 const db
// const 取甚麼名字都沒關係，都會得到 require 路徑 export 出來的資料 (變數、函數、或是其他)
const shop_json = require('./restaurant.json').results
const Shop = require('../shop_db_schema')
const User = require('../user')
const bcrypt = require('bcryptjs')

const SEED_USER = [
  //！！ (上1) 課程全用大寫 (SEED_USER)，不知是啥慣例？ 有機會查查
  { email: 'user1@example.com', pw: '12345678', ownedDataIndex: [0, 1, 2] },
  { email: 'user2@example.com', pw: '12345678', ownedDataIndex: [3, 4, 5] },
]
// console.log(SEED_USER[0].ownedDataIndex.length)

db.once('open', () => {
  SEED_USER.forEach(seed_user => {
    User.findOne({ email: seed_user.email }).then(user => {
      if (user) {
        console.log('此 email 已被註冊，故不建立')
      } else {
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(seed_user.pw, salt))
          .then(hash =>
            User.create({
              email: seed_user.email,
              pw: hash,
            })
          )
          .then(user => {
            const userId = user._id
            seed_user.ownedDataIndex.forEach(i => {
              shop_json[i].userId = userId
              console.log(shop_json[i])

              return Promise.all(Array.from({ length: 1 }, (_ /* 用不到，用 _ 藏起來 */, i) => Shop.create(shop_json[i])))
            })
          })
      }
    })
  })
})
// .then(() => {
//   console.log('done')
//   process.exit() // NODE 提供的 fn.，結束 terminal，相當於 Ctrl+C
// })
