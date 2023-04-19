let secondsLeft

function countDown() {
  if (secondsLeft === 0) {
    self.postMessage('done')  // eslint-disable-line
  } else {
    secondsLeft--
    self.postMessage(secondsLeft)  // eslint-disable-line
    setTimeout(countDown, 1000)
  }
}

self.addEventListener('message', (event) => {  // eslint-disable-line
  if (event.data.type === 'start') {
    secondsLeft = event.data.workingSeconds
    countDown()
  }
})