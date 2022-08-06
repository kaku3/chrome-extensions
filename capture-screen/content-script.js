chrome.runtime.onMessage.addListener(function(request, sender, response) {
  console.log(request, sender, response)
  if(request.message === 'download') {
    download({ data, fileName } = request)
    response(true)
  }
})

function download(o) {
  const d = document.createElement('a');
  d.href = 'data:image/png;base64,' + o.data;
  d.download = o.fileName;
  d.click()  
}
