// var strategy = {"type":"RANDOM", "questions":["single", "multi", "yesno"], "distribute":[2, 1, 2]};



var daysNum = 6;
for (var i = 0; i <= daysNum; i++) {
  let oriDay = 10;

  let sDay = (oriDay + i) + "";
  let eDay = (oriDay + 1 + i) + "";

  if(sDay.length === 1) {
    sDay = "0" + sDay;
  }

  if(eDay.length === 1) {
    eDay = "0" + eDay;
  }

  console.log(
    `INSERT INTO activities VALUES (null, '${"点赞之"+(i-3)}', '${"dwdvote"}', '${"VOTE"}', '${"最美信号工"}', '${"2018-01-"+sDay+" 16:00:00"}', '${"2018-01-"+eDay+" 15:59:59"}', '${1}', null, null, '${"2018-01-11 08:00:00"}', '${"2018-01-11 08:00:00"}');`
  );
}
