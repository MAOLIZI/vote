
export default function(marking) {
  marking = parseInt(marking || 7, 10);

  if(marking<1 && marking>10) {
    console.log("客户给出的评分格式有误，评分规定在 1-10分！");
    return;
  }

  const markingObj = {
    "好评": "good",
    "中评": "normal",
    "差评": "bad"
  };

  let markText = "";      // (如：1-4为差评，5-7 为中评，8-10分为好评)
  if(marking>=8 && marking<=10) {
    markText = "好评";
  }else if(marking>=5 && marking<=7) {
    markText = "中评";
  }else {
    markText = "差评";
  }

  return [markingObj[markText], markText];

}
