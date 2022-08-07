/**
 * install 時に呼ばれる
 */
chrome.runtime.onInstalled.addListener(() => {

  // 各種設定の初期値を storage に保存
  chrome.storage.sync.set({
    file: {
      prefix: 'prefix',
      no1: 0,
      no2: 0,
      name: 'filename',
      urlHost: false,
      urlPath: true
    },
    sizeType: 'page',
    windowSize: {
      width: 800,
      height: 640
    }
  })
})

/**
 * commands メッセージ受信
 */
chrome.commands.onCommand.addListener(async function(c) {
  console.log('+ onCommand()', c)
  if(c === 'takePageScreenshot') {
    takeScreenshot('page', null)
  } else if(c === 'takeWindowScreenshot') {
    takeScreenshot('window', null)
  }
  console.log('- onCommand()')
})

chrome.runtime.onMessage.addListener(function(request, sender, response) {
  console.log('+ onMessage()', request, sender, response)
  takeScreenshot(null, request.rect)
  console.log('- onMessage()')
})

function takeScreenshot(_sizeType, rect) {
  chrome.storage.sync.get(null, (o) => {
    const { file, sizeType } = o
    if(!_sizeType) {
      _sizeType = sizeType
    }
    takeScreenshotImpl(file, _sizeType, rect)
  })
}

async function takeScreenshotImpl(file, sizeType, rect) {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

  console.log('+ takeScreenshotImpl', rect)

  // デバッガの機能でスクリーンショットを撮る：atach ~ capture ~ detach
  chrome.debugger.attach({ tabId: tab.id }, '1.3', async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));    
    console.log('# debugger attach')

    // レイアウト情報取得
    chrome.debugger.sendCommand({ tabId: tab.id }, 'Page.getLayoutMetrics', {}, (metrics) => {
    
      let params = {
        format: 'png'
      }
      if(rect) {
        params = { 
          ...params,
          clip: {
            ...rect,
            scale: 1
          },
          captureBeyondViewport: true
        }
        console.log(params)
      } else if(sizeType === 'page') {
        params = { 
          ...params,
          clip: {
            x: 0,
            y: 0,
            width:  metrics.cssContentSize.width,
            height: metrics.cssContentSize.height,
            scale: 1
          },
          captureBeyondViewport: true
        }        
      }

      // スクリーンショット撮影
      chrome.debugger.sendCommand({ tabId: tab.id }, 'Page.captureScreenshot', params, (result) => {
        chrome.tabs.sendMessage(tab.id, {
          message: 'download',
          data: result.data,
          file: file
        })

        file.no2++
        chrome.storage.sync.set({ file })

        chrome.debugger.detach({ tabId: tab.id }, () => {
          console.log('# debugger detach')
          chrome.runtime.sendMessage(null, { message: 'downloaded', file })
        })
      })
    })
  })
}