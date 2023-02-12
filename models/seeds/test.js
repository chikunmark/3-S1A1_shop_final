const shop_json = require('./restaurant.json').results

const SEED_USER = [
  //！！ (上1) 課程全用大寫 (SEED_USER)，不知是啥慣例？ 有機會查查
  { name: 'First user', email: 'user1@example.com', pw: '12345678', ownedDataIndex: [0, 1, 2] },
  { name: 'Second user', email: 'user2@example.com', pw: '12345678', ownedDataIndex: [3, 4, 5] },
]

const userId = '55555'

// shop_json[1].userId = userId
// console.log(shop_json[1])
console.log(shop_json)
console.log('================')
console.log('================')
console.log('================')

SEED_USER.forEach(function (user) {
  user.ownedDataIndex.forEach(i => {
    shop_json[i].userId = userId
  })
})

// console.log(SEED_USER[0].pw)
console.log(shop_json)
