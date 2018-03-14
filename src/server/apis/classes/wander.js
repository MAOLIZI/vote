// 提供遍历总数的一种遍历策略

// Wander即遍历策略，提供一种方式，在以1开始、到n的数字范围内，提供一种依次遍历所有数字的方式
// 这一个策略的随意性由Seed控制（Seed可以是一个或多个预先指定的变量）。不同的Seed的同一策略遍历方式不同，
// 而这一遍历过程是可以重复的，由变量Progress确定。Progress为遍及进度。从0直到n－1。表明了遍历过程从0到n-1的遍历过程
// 因此，给定Streategy和Seed，总能从Progress得出当前正在遍历的数字（0-n-1之间）。
// 遍历范围n的数字可以是可以增大的。
// 所有strategy必需满足这样一些要求，
//      1. 可重复验证：已知Seed和Progress，必然能够计算出遍历的序列
//      2. Seed唯一决定随机性：相同的Seed，遍历过程必然相同。
//      3. 以0开始。progress和产生的遍历数字均起始于0.
// 部分strategy(MOD,ORDER)额外满足一下条件：
//      1. 与n无关：如果n增大，只要progress小于n的某一个比例，策略自动适应，遍历顺序与n无关
//      2. 遍历：生成的遍历数字绝不重复。

//let xxh = require("xxhashjs");

// 一个从小到大遍历所有数字的策略。1、2、3、4、。。。
// 这个遍历策略和种子无关、和n无关
function OrderSeed(total) {return this;}
OrderSeed.prototype = {
  name: function() {return "ORDER";},
  numberAtProgress: function(progress) {
    if (progress >= 0) {
      return progress;
    } else {
      return -1;
    }
  },
  toString: function() {
    return "";		// Order不需要种子
  },
  loadString: function(str) {}
};

function ModSeed(total, givenSeed) {
  // 为每个房间固定种子

  if (total < 100) {
    console.log("总数太少，不应该使用Mod策略");
  }
  // seed是50到total之间的一个数字
  let seed = 50 + Math.floor((givenSeed || Math.random()) * (total - 50));

  // 如果Seed超过了total的1/4，选择一个更小的Seed，保证MaxN
  if (seed > total / 4) {
    seed = Math.floor(seed % total/4);
  }

  if (seed === 0) { seed = Math.floor(total / 4);}

  // bucket是seed的n倍－1，先确定n
  let maxN = Math.floor(total / seed);		// bucket最大不超过total
  let n = maxN;	// n取2和最大值之间的随机数

  let bucket = seed * n - 1;				// 确定bucket是seed的n倍-1

  this.seedValue = seed;
  this.bucketValue = bucket;

  return this;
}

ModSeed.prototype = {
  name: function() {return "MOD";},
  numberAtProgress: function(progress) {
    let seed = this.seedValue;
    let bucket = this.bucketValue;
    if (progress >= 0) {
      let p = progress + 1;	// progress开始于0，而一下的计算开始于1

      let n = Math.floor(p / bucket);

      // 结果－1，将结果调整为始于0
      let ret =  n*bucket + (p - n * bucket) * seed % bucket - 1;

      return ret;
    } else {
      return -1;
    }
  },

  toString: function() {
    return this.seedValue + "_" + this.bucketValue;
  },

  loadString: function(str) {
    let parts = str.split("_");
    if (parts.length === 2) {
      this.seedValue = parseInt(parts[0], 10);
      this.bucketValue = parseInt(parts[1], 10);
    } else {
      throw "非法的种子字符串" + str;
    }
  },

  getBucketValue: function() {
    return this.bucketValue;
  }
};


// 全随机的种子，生成在0-(总数-1)范围内的随机种子
// 确定了总数后，不能更改

function RandomSeed(total, givenSeed) {
  this.totalValue = total;

  this.seedValue = givenSeed * 23 || Math.floor(Math.random() * 1000000);

  return this;
}

RandomSeed.prototype = {
  name: function() {return "RANDOM";},
  numberAtProgress: function(progress) {

    if (progress >= 0) {
      // let number = xxh(progress.toString(), this.seedValue).toNumber();
      //
      // // 确认数值为正
      // number = number < 0? -number:number;
      //
      // // 保证数值在0-total之间
      // number = number % this.totalValue;
      //
      // return number;
      let number = Math.floor(Math.random() * this.totalValue);
      return number;
    } else {
      return -1;
    }
  },

  toString: function() {
    return (this.totalValue + "_" + this.seedValue);
  },

  loadString: function(str) {
    let parts = str.split("_");
    if (parts.length === 2) {
      this.totalValue = parseInt(parts[0], 10);
      this.seedValue = parseInt(parts[1], 10);
    } else {
      throw "非法的种子字符串" + str;
    }
  }
};

let strategy = function(strategyType, total) {
  return strategy.Seed(strategyType, total);
};

strategy.Seed = function(strategyType, total, givenSeed) {
  if (total < 0) {
    return null;
  }

  try {
    switch(strategyType) {
      case "ORDER":
        return new OrderSeed(total);
      case "MOD":
        if (total < 100) {
          return new OrderSeed(total, givenSeed);
        } else {
          return new ModSeed(total, givenSeed);
        }
        break;
      case "RANDOM":
        return new RandomSeed(total, givenSeed);
      default:
        throw "试图建立不存在的遍历策略:" + strategyType;
    }
  } catch(e) {
    console.log("design", "新建种子发生错误， 策略：" + strategyType);
    return null;
  }
};

strategy.load = strategy.loadSeed = function(strategyType, str) {
  try {
    let seed;
    switch(strategyType) {
      case "ORDER":
        seed = new OrderSeed(1000);
        seed.loadString(str);
        break;
      case "MOD":
        seed = new ModSeed(1000);
        seed.loadString(str);
        break;
      case "RANDOM":
        seed = new RandomSeed(1000);
        seed.loadString(str);
        break;
      default:
        throw "不存在的策略";
    }
    return seed;
  } catch(e) {
    console.log("design", "从字符串建立种子发生错误， 策略：" + strategyType + ", 种子：" + str);
    return null;
  }
};

module.exports = strategy;
