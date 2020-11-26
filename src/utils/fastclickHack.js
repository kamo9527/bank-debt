function hack() {
  const FastClick = require('fastclick');
  FastClick.prototype.focus = function(targetElement) {
    let length = 0;
    const deviceIsWindowsPhone =
      navigator.userAgent.indexOf('Windows Phone') >= 0;
    const deviceIsIOS =
      /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;
    targetElement.focus();
    // Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
    if (
      deviceIsIOS &&
      targetElement.setSelectionRange &&
      targetElement.type.indexOf('date') !== 0 &&
      targetElement.type !== 'time' &&
      targetElement.type !== 'month' &&
      targetElement.type !== 'email'
    ) {
      length = targetElement.value.length;
      targetElement.setSelectionRange(length, length);
    }
  };

  FastClick.prototype.onMouse = function(event) {
    // If a target element was never set (because a touch event was never fired) allow the event
    if (!this.targetElement) {
      return true;
    }

    if (event.forwardedTouchEvent) {
      return true;
    } else {
      this.targetElement = this.getTargetElementFromEventTarget(event.target);
    }

    // Programmatically generated events targeting a specific element should be permitted
    if (!event.cancelable) {
      return true;
    }

    // Derive and check the target element to see whether the mouse event needs to be permitted;
    // unless explicitly enabled, prevent non-touch click events from triggering actions,
    // to prevent ghost/doubleclicks.
    if (!this.needsClick(this.targetElement) || this.cancelNextClick) {
      // Prevent any user-added listeners declared on FastClick element from being fired.
      if (event.stopImmediatePropagation) {
        event.stopImmediatePropagation();
      } else {
        // Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
        event.propagationStopped = true;
      }
      // Cancel the event
      event.stopPropagation();
      event.preventDefault();
      return false;
    }

    // If the mouse event is permitted, return true for the action to go through.
    return true;
  };
  FastClick.attach(document.body);
}

export default hack();
