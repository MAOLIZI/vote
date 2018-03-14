import server from "通用/服务器";


let Running = true;
let DataArray = [];
let Subjects = [];
let UserDataVoted = [];
let ConvertData = {};
let DataMap = {};


async function findData() {
  // 获取所有对象的静态信息
  // let DataArray = await server.get("/api/vote/staticInfos");
  // ALVIN: 此处不能直接给DataArray赋值，因为会将现有的DataArray替换为新的变量。
  let staticInfos = await server.get("/api/vote/staticInfos");

  // 获取所有对象的投票信息(内含 votes 票数)
  let ItemStatus = await server.get("/api/vote/itemStatus");

  // 获得用户投票信息
  try {
    let UserData = await server.get("/api/vote/userStatus");
    UserDataVoted = UserData.voted || [];

    Running = true;
  } catch (e) {
    Running = false;
  }

  // 将 ItemStatus中的 votes & UserDataVoted 数组中找到用户已投对象 id
  // 进而将对于 id 的信息整合到 DataArray/DataMap... 中.
  for (let sItem of staticInfos) {
    // ALVIN: 在此插入DataArray，使用现有的DataAray并推送新的元素。不能替换现有的DataArray
    DataArray.push(sItem);
    sItem.voted = (UserDataVoted.indexOf(sItem.id) >= 0) ? true : false;
    sItem.votes = (ItemStatus.filter(i => i.id===sItem.id)[0] || {}).votes || 0;

    ConvertData[sItem.typeTitle] = (ConvertData[sItem.typeTitle] || []).concat(sItem);
    DataMap[sItem.id] = sItem;
  }

  // 获取投票的所有类别信息
  let sub = await server.get("/api/subjects");
  for (let item of sub) {
    Subjects.push(item);
  }

}

async function DataReady() {
 if(DataArray.length > 0) {
   return true;
 }else {
   await findData();
   return true;
 }
}

export {Running, DataArray, Subjects, UserDataVoted, ConvertData, DataMap, DataReady};
