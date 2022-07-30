/**
 * install 時に呼ばれる
 */
chrome.runtime.onInstalled.addListener(() => {
  // 各種設定の初期値を storage に保存
  chrome.storage.sync.set({
    file: {
      prefix: 'prefix',
      name: 'filename',
      no1: 0,
      no2: 0
    },
    sizeType: 'page',
    windowSize: {
      width: 800,
      height: 640
    }
  })
})
