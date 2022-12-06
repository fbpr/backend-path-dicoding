// TODO: tampilkan teks pada notes.txt pada console.
const fs = require('fs');
const path = require('path');

const data = fs.readFileSync(path.resolve(__dirname, 'notes.txt'), 'UTF-8');

console.log(data);
 
// const fileReadCallback = (error, data) => {
//     if(error) {
//         console.log('Gagal membaca berkas');
//         return;
//     }
//     console.log(data);
// };
 
// fs.readFile(path.resolve(__dirname, 'notes.txt'), 'UTF-8', fileReadCallback);
