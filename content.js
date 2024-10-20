chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "scrapeImages") {
    const images = Array.from(document.getElementsByTagName('img')).map(img => img.src);
    sendResponse({images: images});
  }
  return true;  // 保持消息通道开放
});
