
const toStick = function(datasArr) {
  // 获取具有 stick: true 属性的对象：
  let datas_stick = datasArr.filter( (d) => {return d.stick === true;});
  datas_stick.sort( (m, n) => {return new Date(n.updatedAt) - new Date(m.updatedAt);});

  // 获取普通对象（非置顶）:
  let datas_normal = datasArr.filter( (d) => {return (!d.stick || d.stick === undefined)});
  datas_normal.sort( (m, n) => {return new Date(n.createdAt) - new Date(m.createdAt);});

  let datas = [];  // 声明一个容器，用来存储处理后的数据
  datas_stick.forEach( (d) => {datas.push(d);});
  datas_normal.forEach( (d) => {datas.push(d);});

  return datas;  // 输出处理后数据
};


export {toStick};
