
// let XLSX_FILE = "./“我的绝活”最牛视频展示.xls";
let XLSX_FILE = "./“最美青工”集体活力风采.xls";
const xlsx = require('node-xlsx');
let data = xlsx.parse(XLSX_FILE);

fetchPictureInfo(data[0].data);


function fetchPictureInfo(data) {
  let DATA = [];

  for(let line of data) {
    let [typeTitle, typeSubtitle, title, subtitle, desc] = line;
    typeTitle = `“${typeTitle}”`,
    typeSubtitle = typeSubtitle,
    title = title,
    subtitle = subtitle,
    desc = desc,
    intro = null;

    let filter = "young",
    file = "video",
    poster = `${typeTitle}${typeSubtitle}+${title}+${subtitle}主图.jpg`,
    content = `${typeTitle}${typeSubtitle}+${title}+${subtitle}主图.mp4`,
    other = null,
    votes = 0,
    active = 1,
    updatedAt = "2017-11-26 19:35:06",
    createdAt = "2017-11-26 19:35:06";

    console.log(`INSERT INTO voteitems VALUES (null, '${filter}', '${typeTitle}', '${typeSubtitle}', '${file}', '${poster}', '${title}', '${subtitle}', '${desc}',  '${content}', '${intro}', null, ${0}, ${1}, '${updatedAt}', '${createdAt}');`);
  }

}
