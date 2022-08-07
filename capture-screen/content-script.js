const csc = new CaptureScreenController()

chrome.runtime.onMessage.addListener(async function(request, sender, response) {
  console.log(request, sender, response)
  const { message } = request

  if(message === 'download') {
    const { data, file, rect } = request
    let dataUrl = 'data:image/png;base64,' + data
    if(rect) {
      dataUrl = await clip(dataUrl, rect)
    }
    download(dataUrl, file)
    response(true)
  } else if(message === 'startSelectRange') {
    csc.startSelectRange()
    response(true)
  } else if(message === 'stopSelectRange') {
    csc.stopSelectRange()
    response(true)
  }
})

/**
 * 要素指定スクリーンショット用
 * 全画面スクリーンショットから要素の範囲を切り取る
 * debugger がスクショを撮る時に、どうも横に 16pxずれるような動作をしている気がする
 * @param {*} dataUrl 
 * @param {*} rect 
 * @returns 
 */
function clip(dataUrl, rect) {
  console.log('+ clip()', rect)
  return new Promise((resolve) => {
    const img = document.createElement('img')
    img.onload = function() {
      const canvas = document.createElement('canvas')
      canvas.width = Math.min(rect.width, img.naturalWidth)
      canvas.height = Math.min(rect.height, img.naturalHeight)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img,
        rect.left, rect.top, rect.width, rect.height,
        0,0, rect.width, rect.height)
      resolve(canvas.toDataURL())
    }
    img.src = dataUrl
  })
}

function download(dataUrl, file) {
  const e = document.createElement('a')

  let fileName = `${file.prefix}_${file.no1.toString().padStart(2, '0')}_${file.no2.toString().padStart(2, '0')}_${file.name}`
  if(file.urlHost) {
    fileName += `_${location.host.replace(/[:\/\.]/g, '_')}`
  }
  if(file.urlPath) {
    fileName += `_${location.pathname.replace(/[:\/\.]/g, '_')}`
  }
  fileName += '.png'

  e.href = dataUrl
  e.download = fileName
  e.click()

  const blob = new Blob([base64ToArrayBuffer(dataUrl.split(',')[1])], { type: 'image/png'})
  try{
    navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob
      })
    ]);
  }catch(err){
    // 2022/08/06
    // navigator.clipboard.write は、https サイトでしか動作しない。
    //
    // chrome://flags
    // Insecure origins treated as secure で、サイト指定すれば、 navigator.clipboard.write は動作する。
    //
    // http サイトの場合は、document.execCommand('copy') でコピーをしようとしたが、
    // document.execCommand('copy') は、非推奨 -> 廃止となった模様
    // copyToClipboard(dataUrl)
  }
  csc.finishProcess()
}

/**
 * 2022/08/06 : document.execCommand('copy') is not working.
 * 記録として残しておく
 */
function copyToClipboard(dataUrl) {
  const img = document.createElement('img')
  img.onload = function() {
    const c = document.createElement('div')
    c.contentEditable = 'true'
    c.appendChild(img)
    document.body.appendChild(c)
    selectElement(c)
    document.execCommand('copy')
    window.getSelection().removeAllRanges()
    document.body.removeChild(c)
  }
  img.src = dataUrl
}

function selectElement(element) {
  const range = document.createRange()
  range.selectNodeContents(element)

  const selection = window.getSelection()
  selection.removeAllRanges()
  selection.addRange(range)
}

function base64ToArrayBuffer(base64) {
  const decoded = window.atob(base64)
  const len = decoded.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = decoded.charCodeAt(i)
  }
  return bytes.buffer
}
