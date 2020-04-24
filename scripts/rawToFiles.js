var fs = require('fs')
const path = require('path')

const rawDecks = require('../games/raw.json')
const dataPath = process.argv[3] || 'data'

// USED Before but do not use anymore

const createDir = path => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
}

// Creating files from the rawFile
createDir(dataPath)

rawDecks.order.forEach(o => {
  const oPath = path.join(__dirname, '..', dataPath, o)
  createDir(oPath)
  // Create json
  fs.writeFileSync(path.join(oPath, 'infos.json'), JSON.stringify({
    name: rawDecks[o].name,
    code: o
  }))
  // Create white
  fs.writeFileSync(
    path.join(oPath, 'whites'),
    rawDecks[o].white.map(c => rawDecks.whiteCards[c]).join('\n')
  )
  // Create black json
  fs.writeFileSync(
    path.join(oPath, 'blacks'),
    rawDecks[o].black.map(c => `${rawDecks.blackCards[c].text},${rawDecks.blackCards[c].pick || '0'}`).join('\n')
  )
})
