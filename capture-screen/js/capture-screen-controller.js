class CaptureScreenController {

  static ATTRIBUTE_DATA_HOVER = 'data-extension-capture-screen-controller-hover'

  static lastHoverTarget = null
  static processing = false

  startSelectRange() {
    console.log('+ startSelectRange()')
    document
      .querySelectorAll("*")
      .forEach(e => e.addEventListener("click", CaptureScreenController.onClick, {
        passive: false,
        capture: true
      }));
    $(`*`).on("mouseover mouseleave", "body", CaptureScreenController.onHover);
  }

  stopSelectRange() {
    console.log('+ stopSelectRange()')
    CaptureScreenController.removeHover()
    document
      .querySelectorAll("*")
      .forEach(e => e.removeEventListener("click", CaptureScreenController.onClick, {
        passive: false,
        capture: true
      }));
    $("*").off("mouseover mouseleave", "body", CaptureScreenController.onHover);
  }

  finishProcess() {
    CaptureScreenController.processing = false
  }

  static onClick(e) {
    console.log('+ onClick', e)
    const r = e.target.getBoundingClientRect()
    const rect = {
      left : r.left,
      top : r.top,
      width : r.width,
      height : r.height
    }

    CaptureScreenController.removeHover()
    CaptureScreenController.processing = true

    // background で撮影
    chrome.runtime.sendMessage(null, { message: 'takeScreenshot', rect })  

    e.preventDefault();
    e.stopPropagation();
  }
  static onHover(e) {
    console.log('+ onHover', e)

    if(CaptureScreenController.processing) {
      return
    }

    CaptureScreenController.removeHover()
    CaptureScreenController.setHover(e.target)
  }

  static setHover(e) {
    e.setAttribute(CaptureScreenController.ATTRIBUTE_DATA_HOVER, '')
    CaptureScreenController.lastHoverTarget = e
  }

  static removeHover() {
    if(CaptureScreenController.lastHoverTarget) {
      CaptureScreenController.lastHoverTarget.removeAttribute(
        CaptureScreenController.ATTRIBUTE_DATA_HOVER
      )
    }
  }
}
