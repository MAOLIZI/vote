function getUrlForImage(image) {
  if (typeof image === "object" && image.src) {
    image = image.src;
  }
  if ((image || "").indexOf("api/") <0) {
    image = window.ossPath + 'img/' + image;
  }
  return image;
}

module.exports = getUrlForImage;
