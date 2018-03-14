// let XLSX_FILE = "./“我的职业”最美瞬间摄影.xls";
// const xlsx = require('node-xlsx');
// let data = xlsx.parse(XLSX_FILE);

// let fs = require("fs-extra");
// let files = fs.readdirSync("./“我的职业”最美瞬间摄影");
// for (let file of files) {
//   console.log(file);
//
//
// }

// let Extractor = require("word-extractor");
// let extractor = new Extractor();
//
// async function start() {
//   let content = await extractor.extract("./a.doc");
//   let text = "";
//   for(piece of content.pieces){
//     text += piece.text.replace(/\r/g, "\n");
//   }
//   console.log(text);
// }
// start();




let XLSX_FILE = "./“我的职业”最美瞬间摄影.xls";
const xlsx = require('node-xlsx');
let data = xlsx.parse(XLSX_FILE);

fetchPictureInfo(data[0].data);


function fetchPictureInfo(data) {
  let DATA = [];

  for(let line of data) {
    let [typeTitle, typeSubtitle, title, subtitle, desc, picNum, intro] = line;
    typeTitle = `“${typeTitle}”`,
    typeSubtitle = typeSubtitle,
    title = title,
    subtitle = subtitle,
    desc = desc,
    intro = intro;

    let contentArr = [];
    for (var i = 0; i < picNum; i++) {
      contentArr.push(`${typeTitle}${typeSubtitle}+${title}+${subtitle}副图0${i+1}.jpg`);
    }

    let filter = "young",
    file = "picture",
    poster = `${typeTitle}${typeSubtitle}+${title}+${subtitle}主图.jpg`,
    content = contentArr,
    other = null,
    votes = 0,
    active = 1,
    updatedAt = "2017-11-26 19:35:06",
    createdAt = "2017-11-26 19:35:06";

    console.log(`INSERT INTO voteitems VALUES (null, '${filter}', '${typeTitle}', '${typeSubtitle}', '${file}', '${poster}', '${title}', '${subtitle}', '${desc}',  '${JSON.stringify(content)}', '${intro}', null, ${0}, ${1}, '${updatedAt}', '${createdAt}');`)


    // DATA.push({
    //   "filter": "young",
    //   "typeTitle": `“${typeTitle}”`,
    //   "typeSubtitle": typeSubtitle,
    //   "file": "picture",
    //   "poster": `“${typeTitle}”${typeSubtitle}+${typeTitle}+${typeTitle}主图.jpg`,
    //   "title": title,
    //   "subtitle": subtitle,
    //   "desc": `${desc}`,
    //   "content": contentArr,
    //   "intro": intro,
    //   "other": null,
    //   "votes": 0,
    //   "active": 1,
    //   "updatedAt": "2017-11-26 19:35:06",
    //   "createdAt": "2017-11-26 19:35:06"
    // });
  }

  // console.log(JSON.stringify(DATA));
}
