import numeral from "numeral";   // {_input: 3.987, _value: 3.987}

const changeCash = function(number) {
  if (!number) return "--";

  return numeral(number).format("0,0.00");
};

export {changeCash};
