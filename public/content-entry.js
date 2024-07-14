/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */

; (async function () {
  await import(chrome.runtime.getURL('./content.js'))
})()
