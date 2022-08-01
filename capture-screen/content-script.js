
function takeScreenShot(fileName, sizeType) {
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

    chrome.runtime.sendMessage({
      message: 'downloaded'
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
    const { file, sizeType } = request
    const fileName = `${file.prefix}_${file.no1.toString().padStart(2, '0')}_${file.no2.toString().padStart(2, '0')}_${file.name}.png`

    takeScreenShot(fileName, sizeType)
    response(true)
  }
})
