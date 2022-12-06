// const shop = {
//   message: "Berikut daftar kopi yang tersedia",
//   coffees: [
//     {
//       id: 1,
//       name: "Kopi Tubruk",
//       price: 12000,
//     },
//     {
//       id: 2,
//       name: "Kopi Tarik",
//       price: 15000,
//     },
//     {
//       id: 3,
//       name: "Kopi Jawa",
//       price: 18000,
//     },
//   ],
// };

// function CoffeeShop(obj) {
//   for (let key in obj) {
//     if (typeof obj[key] === "object") {
//       CoffeeShop(obj[key]);
//     } else {
//       console.log(obj[key]);
//     }
//   }
// }

// CoffeeShop(shop);

const moment = require('moment');
 
const date = moment().format("MMM Do YY");
console.log(date);