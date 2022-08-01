chrome.storage.sync.get(null, (o) => {
  const { file, sizeType, windowSize } = o
  $('input[name=filePrefix]').val(file.prefix)
  $('input[name=fileName]').val(file.name)
  $('input[name=fileNo1]').val(file.no1)
  $('input[name=fileNo2]').val(file.no2)

  $('input[type=radio][name=sizeType]').val([ sizeType ])
  $('input[name=width]').val(windowSize.width)
  $('input[name=height]').val(windowSize.height)
})

$('input[name=filePrefix]').change(function() {
  const v = $(this).val()
  chrome.storage.sync.get('file', (o) => {
    const { file } = o
    file.prefix = v
    chrome.storage.sync.set({ file })
  })
})
$('input[name=fileName]').change(function() {
  const v = $(this).val()
  chrome.storage.sync.get('file', (o) => {
    const { file } = o
    file.name = v
    chrome.storage.sync.set({ file })
  })
})
$('input[name=fileNo1]').change(function() {
  const v = $(this).val()
  chrome.storage.sync.get('file', (o) => {
    const { file } = o
    file.no1 = Number(v)
    chrome.storage.sync.set({ file })
  })
})
$('input[name=fileNo2]').change(function() {
  const v = $(this).val()
  chrome.storage.sync.get('file', (o) => {
    const { file } = o
    file.no2 = Number(v)
    chrome.storage.sync.set({ file })
  })
})
$('input[type=radio][name=sizeType]').change(function() {
  const v = $(this).val()
  console.log(v)
  chrome.storage.sync.get('sizeType', (o) => {
    let { sizeType } = o
    sizeType = v
    chrome.storage.sync.set({ sizeType })
  })
})
//
// take screen shot.
//
const takeButton = document.getElementById('take')
takeButton.addEventListener('click', async () => {
  console.log('+ take()')
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

  takeButton.classList.add('processing')
  chrome.storage.sync.get(null, (o) => {
    const { file, sizeType } = o

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
    $('input[name=fileNo2]').val(file.no2)
  })    
})

//
// resize button.
//
const resizeWindowButton = document.getElementById('resizeWindow')
resizeWindowButton.addEventListener('click', () => {

  const windowSize = {
    width: Number($('input[type=number][name=width]').val()),
    height: Number($('input[type=number][name=height]').val())
  }
  chrome.storage.sync.set({ windowSize })

  const o = ((windowSize.width === 0) && (windowSize.height === 0)) ?
    { state: 'maximized' } : { ...windowSize }
  chrome.windows.update(chrome.windows.WINDOW_ID_CURRENT, o)
})

chrome.runtime.onMessage.addListener(function(request, sender, response) {
  if(request.message === 'downloaded') {
    takeButton.classList.remove('processing')
  }
  console.log(request, sender, response)
})
