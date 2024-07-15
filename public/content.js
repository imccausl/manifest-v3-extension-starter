/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */

; (async function () {
  const getExtensionAPI = () => {
    return globalThis.browser?.runtime ? globalThis.browser : globalThis.chrome
  }
  await import((getExtensionAPI().runtime.getURL('./content-script.js')))
})()
