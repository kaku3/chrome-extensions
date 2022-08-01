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


chrome.commands.onCommand.addListener(async function(c) {
  if(c === 'take') {
    console.log('+ take()')
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

    chrome.storage.sync.get(null, (item) => {
      const { file, sizeType } = item

      chrome.tabs.sendMessage(tab.id,
        {
          message: 'takeScreenShot',
          file,
          sizeType
        },
        (response) => {
          console.log('- take()', response)
        })
      file.no2++
      chrome.storage.sync.set({ file })
    })    
  }
})
