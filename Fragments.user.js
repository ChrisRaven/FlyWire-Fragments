// ==UserScript==
// @name         Fragments
// @namespace    KrzysztofKruk-FlyWire
// @version      0.1
// @description  Keeps history of removed framents
// @author       Krzysztof Kruk
// @match        https://ngl.flywire.ai/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/ChrisRaven/FlyWire-Fragments/main/Fragments.user.js
// @downloadURL  https://raw.githubusercontent.com/ChrisRaven/FlyWire-Fragments/main/Fragments.user.js
// @homepageURL  https://github.com/ChrisRaven/FlyWire-Fragments
// ==/UserScript==

if (!document.getElementById('dock-script')) {
  let script = document.createElement('script')
  script.id = 'dock-script'
  script.src = typeof DEV !== 'undefined' ? 'http://127.0.0.1:5501/FlyWire-Dock/Dock.js' : 'https://chrisraven.github.io/FlyWire-Dock/Dock.js'
  document.head.appendChild(script)
}

let wait = setInterval(() => {
  if (globalThis.dockIsReady) {
    clearInterval(wait)
    main()
  }
}, 100)


let fragments = []


function main() {
  let dock = new Dock()

  let lsData = Dock.ls.get('fragments', true)
  if (lsData) {
    fragments = lsData
  }

  dock.addAddon({
    name: 'Fragments',
    id: 'kk-fragments',
    html: generateHtml(),
    css: generateCss(),
    events: {}
  })
}


function generateHtml() {
  let html = ''
  for (let i = 0; i < 10; i++) {
    html += '<div class="fragment"></div>'
  }

  return html
}


function generateCss() {
  return /*css*/`
    #kk-fragments .fragment {
      display: inline-block;
      width: 15px;
      height: 15px;
      background-color: yellow;
      border: 1px solid black;
    }
  `
}