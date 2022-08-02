console.log('+ background')

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
    sizeType: 'tab',
    windowSize: {
      width: 800,
      height: 640
    }
  })
})


chrome.commands.onCommand.addListener(async function(c) {
  if(c === 'take') {
    console.log('+ take()')
    // let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

    // chrome.tabs.sendMessage(tab.id,
    //   {
    //     message: 'takeScreenShot'
    //   },
    //   (response) => {
    //     console.log('- take()', response)
    //   })

    takeScreenShot()
  }
})

chrome.runtime.onMessage.addListener(function(request, sender, response) {
  console.log(request, sender, response)
  if(request.message === 'test') {
    takeScreenShot()
  }
  response(true)
})
