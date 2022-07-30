chrome.storage.sync.get(null, (item) => {
  const { file, sizeType, windowSize } = item
  $('input[name=filePrefix]').val(file.prefix)
  $('input[name=fileName]').val(file.name)
  $('input[name=fileNo1]').val(file.no1)
  $('input[name=fileNo2]').val(file.no2)

  $('input[type=radio][name=sizeType]').val([ sizeType ])
  $('input[name=width]').val(windowSize.width)
  $('input[name=height]').val(windowSize.height)
})


//
// take screen shot.
//
const takeButton = document.getElementById('take')
takeButton.addEventListener('click', async () => {
  console.log('+ take()')
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

  const file = {
    prefix: $('input[name=filePrefix]').val(),
    name: $('input[name=fileName]').val(),
    no1: Number($('input[name=fileNo1]').val()),
    no2: Number($('input[name=fileNo2]').val())
  }
  const sizeType = $('input[type=radio][name=sizeType]:checked').val()
  chrome.tabs.sendMessage(tab.id,
    {
      method: 'takeScreenShot',
      file,
      sizeType
    },
    (response) => {
    })

  // ss取るたびに自動インクリメントする
  file.no2++
  $('input[name=fileNo2]').val(file.no2)

  chrome.storage.sync.set({ file, sizeType })


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

