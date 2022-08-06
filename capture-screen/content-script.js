chrome.runtime.onMessage.addListener(function(request, sender, response) {
  console.log(request, sender, response)
  if(request.message === 'download') {
    download({ data, fileName } = request)
    response(true)
  }
})

function download(o) {
  const dataUrl = 'data:image/png;base64,' + o.data
  const e = document.createElement('a')
  e.href = dataUrl
  e.download = o.fileName
  e.click()

  const blob = new Blob([base64ToArrayBuffer(o.data)], { type: 'image/png'})
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
    // copyToClipboard()
  }
}

/**
 * 2022/08/06 : document.execCommand('copy') is not working.
 * 記録として残しておく
 */
function copyToClipboard() {
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