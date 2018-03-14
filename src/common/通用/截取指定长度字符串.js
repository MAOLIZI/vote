
const cutString =  function(content, len) {
  content = content || "";
  len = (len && len>0) ? len : 10;


  let contentLen = content.length;

  if(contentLen > len) {
    content = content.substring(0, len) + "......";
  }

  return content;
};


export {cutString};
