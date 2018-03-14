/*
let {a,b,c} = {a:1,b:2,c:5};
console.log(a,b,c);
*/


/*let arr = [1,2,3];
//复制一个出来，这样改变其中一个，原本的是不会改变的
//let arr2 = Array.from(arr);
//let arr2 = arr;
let arr2 = [...arr];
arr2.pop();
console.log(arr,arr2);*/



//三个点spread的用法
/*function test(...args){
  console.log(args);
}
test(1,2,3,4);*/


//for of 和Map对象配合使用才能发挥for of的功能
/*let map = new Map();
map.set("a","apple");
map.set("b","branner");
map.set("c","orange");
map.set("d","pear");*/
//map.delete("b")
//  console.log(map);
//console.log(map.get("a"));
//map和json很像，json可以用for in来遍历，但是map却不能用for in遍历，而要用for of来遍历
//遍历的这个值是包括key和值的一个数组，所以可以用key，value拿到相应的变量。
//默认情况下，map循环其实是循环map里面的entries()，不加entries()就是默认循环entries();
/*for(let [key,value] of map.entries()){
  console.log(key,value);
}*/
//map.keys()只循环keys
/*for(let key of map.keys()){
  console.log(key);
}*/
//map.values()只循环values
/*for(let value of map.values()){
  console.log(value);
}*/

/*let a = `字符串模板`;
let str = `什么是ES6? ES6和javascript的关系 ES的发展和兼容性 let和const ${a} 解构赋值 复制数组——spread Map for-of循环 箭头函数 对象的简洁语法 class和extends 模块化-export,import Promise Generator、yield`

console.log(str);*/


//Promise 承诺  就是一个对象，用来传递异步操作的数据（消息）
//三个状态 ：pending（等待，处理中）Resolve（完成，fullFiled） Rejected（拒绝，失败）
//cache方法，then方法，all方法
/*let p1 = new Promise((resolve,reject)=>{
  /!*if("异步处理成功"){
    resolve();
  }else{
    reject();
  }*!/
  resolve(1);
});*/
//Promise可以一直传递下去
/*p1.then((data)=>{
  console.log(`成功了！${data}`);
  return data+1
},(data)=>{
  console.log(`失败了！${data}`);
}).then((data)=>{
  console.log(data);
});*/


//nodejs运用Promise对象
/*const fs = require("fs");
fs.readFile("config.js",(err,data)=>{
  let p1 = new Promise((resolve,reject)=>{
    if(err){
      reject(err);
    }else{
      resolve(data);
    }
  });
  p1.then((data)=>{
    console.log(data.toString());
  },(err)=>{
    console.log(err);
  });
});*/


//catch 捕获错误 实例化后的方法
/*let p1 = new Promise((resolve,reject)=>{
  resolve(1);
});
p1.then((data)=>{
  console.log(data);
  throw "发生错误了！";   //抛出一个错误
}).catch((err)=>{   //cache捕获错误
  console.log(err);
})*/


//all 全部，用于将多个Promise对象，组合，包装成一个全新的Promise实例，Promise.all([p1,p2,p3...]);这个方法是Promise上的
//只有当所有的Promise对象都成功，才成功，如果一个失败了就失败了。
/*let p1 = Promise.resolve(1);
let p2 = Promise.reject(5);
Promise.all([p1,p2]).then((data)=>{
  console.log(`成功了！${data}`);
},(data)=>{
  console.log(`失败了!${data}`);
})*/


//race 返回第一个Promise对象，最先执行到的Promise的结果，这个方法也是Promise.race()
/*let p1 = new Promise((resolve,reject)=>{
  setTimeout(resolve,500,"one");
});
let p2 = new Promise((resolve,reject)=>{
  setTimeout(resolve,100,"two");
});
Promise.race([p1,p2]).then((data)=>{
  console.log(data);
});*/


//Promise.resolve(data||Promise)生成一个成功的Promise对象，
//Promise.reject()生成一个失败的Promise对象
/*Promise.resolve("success").then((data)=>{
  console.log(data);
},(value)=>{

});*/
/*Promise.reject("失败").then((data)=>{
},(data)=>{
  console.log(data);
});*/
/*let p1 = Promise.resolve(3);
let p2 = Promise.resolve(p1); //这里传了一个Promise进去
p2.then((data)=>{
  console.log(data)
})*/



//Generrator ---生成器
//yield语句没有返回值，或者每次返回undefined
/*function* show(){
  yield "hello";
  yield "world";
  yield "es6";
  return "well"
}
let res = show();
console.log(res.next());
console.log(res.next());
console.log(res.next());
console.log(res.next());*/
