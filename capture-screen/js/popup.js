sendMessageToContentScript({ message: 'stopSelectRange' })

chrome.storage.sync.get(null, (o) => {
  const { file, sizeType, windowSize } = o
  $('input[name=filePrefix]').val(file.prefix)
  $('input[name=fileNo1]').val(file.no1)
  $('input[name=fileNo2]').val(file.no2)
  $('input[name=fileName]').val(file.name)
  $('input[name=urlHost]').prop('checked', file.urlHost)
  $('input[name=urlPath]').prop('checked', file.urlPath)

  $('input[type=radio][name=sizeType]').val([ sizeType ])
  $('input[name=width]').val(windowSize.width)
  $('input[name=height]').val(windowSize.height)
})

$('input[name=filePrefix]').change(function() {
  updateFile({ prefix: $(this).val() })
})
$('input[name=fileName]').change(function() {
  updateFile({ name: $(this).val() })
})
$('input[name=fileNo1]').change(function() {
  updateFile({ no1: Number($(this).val()) })
})
$('input[name=fileNo2]').change(function() {
  updateFile({ no2: Number($(this).val()) })
})
$('input[type=checkbox][name=urlHost]').change(function() {
  console.log($(this).prop('checked'))
  updateFile({ urlHost: $(this).prop('checked') })
})
$('input[type=checkbox][name=urlPath]').change(function() {
  console.log($(this).prop('checked'))
  updateFile({ urlPath: $(this).prop('checked') })
})


$('input[type=radio][name=sizeType]').change(function() {
  chrome.storage.sync.set({ sizeType: $(this).val() })
})

function updateFile(v) {
  chrome.storage.sync.get('file', (o) => {
    let { file } = o
    file = { ...file, ...v }
    chrome.storage.sync.set({ file })
  })
}


//
// take screen shot.
//
const takeButton = document.getElementById('take')
takeButton.addEventListener('click', () => {
  console.log('+ take()')
  takeButton.classList.add('processing')

  // background で撮影
  chrome.runtime.sendMessage(null, { message: 'takeScreenshot' })  
})

// 範囲キャプチャ開始 / 停止
const toggleSelectRangeButton = document.getElementById('toggleSelectRange')
toggleSelectRangeButton.addEventListener('click', function(e) {
  const action = $(this).text()

  if(action === 'Start') {
    sendMessageToContentScript({
      message: 'startSelectRange'
    })
  } else {
    sendMessageToContentScript({
      message: 'stopSelectRange'
    })
  }
  $(this).text(action === 'Start' ? 'Stop' : 'Start')
})

//
// resize button.
//
const resizeWindowButton = document.getElementById('resizeWindow')
resizeWindowButton.addEventListener('click', function(e) {

  const windowSize = {
    width: Number($('input[type=number][name=width]').val()),
    height: Number($('input[type=number][name=height]').val())
  }
  chrome.storage.sync.set({ windowSize })

  const o = ((windowSize.width === 0) && (windowSize.height === 0)) ?
    { state: 'maximized' } : { ...windowSize }
  chrome.windows.update(chrome.windows.WINDOW_ID_CURRENT, o)
})

/**
 * message
 */
chrome.runtime.onMessage.addListener(function(request, sender, response) {
  console.log(request, sender, response)
  if(request.message === 'downloaded') {
    takeButton.classList.remove('processing')
    $('input[name=fileNo2]').val(request.file.no2)
  }
})


async function sendMessageToContentScript(o) {
  let [ tab ] = await chrome.tabs.query({ active: true, currentWindow: true })
  chrome.tabs.sendMessage(tab.id, o)
}