
let XLSX_FILE = "./最美信号工（20180111）.xlsx";
const xlsx = require('node-xlsx');
let data = xlsx.parse(XLSX_FILE);

fetchPictureInfo(data[0].data);

function fetchPictureInfo(data) {
  let sortby = -1;

  for(let line of data) {
    sortby += 1;

    let [typeTitle, title, subtitle, sex, content] = line;
    content = `${content}`;

    let filter = "dwdvote",
    file = "text",
    poster = `${title}.jpg`,
    votes = 0,
    active = 1,
    updatedAt = "2018-1-11 12:41:43",
    createdAt = "2018-1-11 12:41:43";

    content = JSON.stringify(content);
    content = content.substring(1, content.length-1);
    console.log(`INSERT INTO voteitems VALUES (null, '${filter}', ${sortby}, '${typeTitle}', null, ${0}, ${1}, '${file}', '${title}', '${subtitle}', ${sex}, '${poster}', null, '${JSON.stringify(content)}', null, null, '${updatedAt}', '${createdAt}');`);
  }

}

// ******* 检测数据库字段是否合法 ************
// SELECT JSON_VALID(content) FROM voteitems;
