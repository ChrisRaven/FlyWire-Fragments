// ==UserScript==
// @name         Fragments
// @namespace    KrzysztofKruk-FlyWire
// @version      0.1
// @description  Keeps history of removed fragments
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
const MAX_NO_OF_FRAGMENTS = 10


function main() {
  let dock = new Dock()

  let lsData = Dock.ls.get('fragments', true)
  if (lsData) {
    fragments = lsData
  }

  dock.addAddon({
    name: 'Fragments',
    id: 'kk-fragments',
    html: '<div id="kk-fragments-container">' + generateBoxesHtml() + '</div>',
    css: generateCss(),
    events: {
      '#kk-fragments': {
        click: e => fragmentClicked(e)
      }
    }
  })

  let graphLayer = Dock.layers.getByType('segmentation_with_graph', false)

  if (!graphLayer) return

  graphLayer[0].layer.displayState.rootSegments.changed.add((id, added) =>rootSegmentsChangedHandler(id, added))
}


function fragmentClicked(e) {
  if (!e.target.classList.contains('fragment')) return
  if (e.target.classList.contains('empty-fragment')) return

  let id = Dock.stringToUint64(e.target.dataset.id)

  let graphLayer = Dock.layers.getByType('segmentation_with_graph', false)

  if (!graphLayer) return

  graphLayer[0].layer.displayState.rootSegments.add(id)
}


function rootSegmentsChangedHandler(id, added) {
  if (added || !id) return

  id = id.toJSON()

  if (fragments.includes(id)) {
    let index = fragments.indexOf(id)
    fragments.splice(index, 1)
  }

  if (fragments.length === MAX_NO_OF_FRAGMENTS) {
    fragments.shift()
  }

  fragments.push(id)
  Dock.ls.set('fragments', fragments, true)
  rebuildBoxes()
}


function generateBoxesHtml() {
  let diff = MAX_NO_OF_FRAGMENTS - fragments.length
  let html = ''

  if (diff) {
    for (let i = 0; i < diff; i++) {
      html += '<div class="fragment empty-fragment"></div>'
    }
  }

  for (let i = diff; i < MAX_NO_OF_FRAGMENTS; i++) {
    let fragId = fragments[i - diff]
    html += `<div class="fragment" data-id="${fragId}" title="${fragId}"></div>`
  }

  return html
}


function rebuildBoxes() {
  document.getElementById('kk-fragments-container').innerHTML = generateBoxesHtml()
}


function generateCss() {
  return /*css*/`
    #kk-fragments .fragment {
      display: inline-block;
      width: 15px;
      height: 15px;
      background-color: yellow;
      border: 1px solid black;
      cursor: pointer;
    }

    #kk-fragments .empty-fragment {
      background-color: gray;
      cursor: default;
    }
  `
}
