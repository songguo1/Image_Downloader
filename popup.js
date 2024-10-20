document.addEventListener('DOMContentLoaded', function() {
  const scrapeButton = document.getElementById('scrapeButton');
  const imageContainer = document.getElementById('imageContainer');

  scrapeButton.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "scrapeImages"}, function(response) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          alert('发生错误，请刷新页面后重试。');
          return;
        }
        
        imageContainer.innerHTML = '';
        if (response && response.images && response.images.length > 0) {
          response.images.forEach(function(imgSrc) {
            const imgElement = document.createElement('div');
            imgElement.className = 'image-item';
            imgElement.innerHTML = `<img src="${imgSrc}" alt="Scraped Image">`;
            imgElement.addEventListener('click', function() {
              copyImageToClipboard(imgSrc);
            });
            imageContainer.appendChild(imgElement);
          });
        } else {
          imageContainer.innerHTML = '<p>未找到图片</p>';
        }
      });
    });
  });

  function copyImageToClipboard(imgSrc) {
    fetch(imgSrc)
      .then(response => response.blob())
      .then(blob => {
        const item = new ClipboardItem({ "image/png": blob });
        navigator.clipboard.write([item]).then(function() {
          alert('图片已复制到剪贴板！');
        }, function(error) {
          console.error('复制失败: ', error);
        });
      });
  }
});
