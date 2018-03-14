// 辅助activity的出题策略，是utils/strategy的包装，针对不同出题要求进行出题
const util = require("util");
const extend = util._extend;
const Questions = require("../models/questions");

const store = require("server/store")();
const token = require('server/util/token');
const config = require("util/config");
const wander = require("./wander");

let questionsMap = {};

// 缓存各类型问题总数
async function loadQuestionData() {
  let questions = await Questions.find({"order": "id ASC"});
  for (let question of questions) {
    let type = question.type;
    if (!questionsMap[type]) {
      questionsMap[type] = [];
    }
    questionsMap[type].push(question.id);
  }
}

// 载入所有问题
loadQuestionData();


// 返回一个Strategy对象，针对该出题策略
// strategy可以是一个对象，或者一个JSON.stringify的字符串
// strategy: {
// 		type: "MOD" or "RANDOM" or "ORDER",
// 		questions: ["questionType1", "questionType2"]
// }

let QuestionStrategy = function(strategyStr) {
  let strategy;
  // 将字符串转化为对象
  if (typeof strategyStr === "string") {
    try{
      strategy = JSON.parse(strategyStr);
    } catch(e) {
      //log.error("不正确的QuestionStrategy", strategyStr);
      console.log("不正确的QuestionStrategy", strategyStr);
      return null;
    }
  } else if (typeof strategyStr !== "object") {
    //log.error("不正确的QuestionStrategy", strategyStr);
    console.log("不正确的QuestionStrategy", strategyStr);
    return null;
  }else{
    strategy = strategyStr;
  }

  this.strategy = strategy;
  // 计算问题总数
  let totalQ = 0;

  strategy.questions.forEach(function(current) {
    totalQ += (questionsMap[current] || []).length;
  });
  this._totalQuestions = totalQ;
  // 设置遍历策略
  this.wander = wander.Seed(strategy.type, totalQ);
};

extend(QuestionStrategy.prototype, {
  loadSeed: function(seed) {
    this.wander.loadString(seed);
  },

  newSeed: function(givenSeed) {
    if (this.strategy.type === "MOD" && this.strategy.seed > 0) {
      return wander.Seed(this.strategy.type, this._totalQuestions, this.strategy.seed).toString();
    } else {
      return wander.Seed(this.strategy.type, this._totalQuestions, givenSeed).toString();
    }
  },

  numberToId: function(number) {
    let types = this.strategy.questions;
    let base = (questionsMap[types[0]] || []).length;
    let previousBase = 0;
    let library = questionsMap[types[0]];
    for (let i=1; i<types.length; i++) {
      if (number <= base) {
        return {id: library[number-previousBase], questionType: types[i-1]};
      }
      previousBase = base;
      base += (questionsMap[types[i]] || []).length;
      library = questionsMap[types[i]];
    }

    return {id: library[number-previousBase], questionType: types[types.length-1]};
  },

  questionAtProgress: function(progress) {
    let number = this.numberAtProgress(progress);
    let id =  this.numberToId(number);
    //console.log(progress, ":", index, ":",  id );
    return id;
  },

  numberAtProgress: function(progress, notry) {
    let id = this.wander.numberAtProgress(progress);  // 将结果开始于0

    if(this.strategy.distribute && Array.isArray(this.strategy.distribute)) {
      let types = this.strategy.questions;
      let distribute = this.strategy.distribute;
      let base = 0;
      let questionBase = 0;
      for (let i=0; i<distribute.length; i++) {
        base += parseInt(distribute[i], 10);
        if (progress < base) {
          // 应在该类别中
          id = ((id-1) % (questionsMap[types[i]] || []).length) + questionBase + 1;
          break;
        }
        questionBase += (questionsMap[types[i]] || []).length;
      }
    }

    if(this.strategy.type === "RANDOM" && !notry) {
      let past = this.pastIds || [];
      let tries = 0;
      while(past.indexOf(id) >= 0 && tries < 3) {
        id = this.numberAtProgress(progress, true);
        tries ++;
      }
      past.push(id);
      this.pastIds = past;
    }

    return id;
  },

  enrollmentStrategy: function(user) {
    let strategy = extend({}, this.strategy);
    let questions = [];

    // 复制数组
    for (let i=0; i<strategy.questions.length; i++) {
      questions.push(strategy.questions[i]);
    }

    strategy.questions = questions;
    return strategy;
  },

  totalQuestions: function() {
    return this._totalQuestions;
  },

  getBucketValue: function() {
    if (this.wander.getBucketValue) {
      return this.wander.getBucketValue();
    } else {
      return -1;
    }
  }
});


module.exports = async function(strategy) {
  return new QuestionStrategy(strategy);
};
