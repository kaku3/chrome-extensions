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
takeButton.addEventListener('click', async () => {
  console.log('+ take()')
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

  takeButton.classList.add('processing')
  chrome.tabs.sendMessage(tab.id,
    {
      message: 'takeScreenShot'
    },
    (response) => {
      console.log('- take()', response)
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
    $('input[name=fileNo2]').val(request.file.no2)

    takeButton.classList.remove('processing')
  }
  console.log(request, sender, response)
})
