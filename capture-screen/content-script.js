
function takeScreenShot(fileName, sizeType, file) {
  console.log(sizeType, fileName)
  const body = document.querySelector('body')
  const o = (sizeType === 'view') ?
    {
      x: window.scrollX,
      y: window.scrollY,
      width: window.innerWidth,
      height: window.innerHeight,
    } :
    {}

  html2canvas(body, o).then(canvas => {
    downloadImage(fileName, canvas.toDataURL())

    file.no2++
    chrome.storage.sync.set({ file })

    chrome.runtime.sendMessage({
      message: 'downloaded',
      file
    })

  })
}

/**
 * 
 * @param {*} data 
 */
function downloadImage (fileName, data) {
  const a = document.createElement("a")
  a.href = data
  a.download = fileName
  a.click()
}

chrome.runtime.onMessage.addListener(function(request, sender, response) {
  console.log(request, sender, response)
  if(request.message === 'takeScreenShot') {
    chrome.storage.sync.get(null, (o) => {
      const { file, sizeType } = o
      const fileName = `${file.prefix}_${file.no1.toString().padStart(2, '0')}_${file.no2.toString().padStart(2, '0')}_${file.name}.png`
      takeScreenShot(fileName, sizeType, file)
    })

    response(true)
  }
})
