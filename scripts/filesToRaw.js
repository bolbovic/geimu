const lineReader = require('line-reader')
const path = require('path')
const util = require('util')
const fs = require('fs')

// node script/addToRaw <file_name_white_card> <file_name_black_card> <deckname> <deckcode>

const rawDecks = {
  blackCards: [],
  whiteCards: [],
  order: []
}

const getDirectories = source =>
  fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

const eachLine = util.promisify(lineReader.eachLine)

async function addToRaw (deck, fWhites, fBlacks) {
  const whiteCards = []
  await eachLine(fWhites, line => {
    if (line && line !== '') {
      whiteCards.push(line)
    }
  })

  const blackCards = []
  await eachLine(fBlacks, line => {
    if (line && line !== '') {
      const text = line.splice(0, -2)
      const pick = line.splice(-2)
      blackCards.push({ text, pick })
    }
  })

  const whiteIdx = []
  let i
  for (i = 0; i < whiteCards.length; i++) {
    whiteIdx.push(i + rawDecks.whiteCards.length)
  }

  const blackIdx = []
  for (i = 0; i < blackCards.length; i++) {
    blackIdx.push(i + rawDecks.blackCards.length)
  }

  // add to raw
  rawDecks.whiteCards = rawDecks.whiteCards.concat(whiteCards)
  rawDecks.blackCards = rawDecks.blackCards.concat(blackCards)
  rawDecks[deck.code] = Object.assign(deck, {
    black: blackIdx,
    white: whiteIdx
  })
  rawDecks.order.push(deck.code)
}

const dataDir = path.join(__dirname, '..', 'data')

async function processing () {
  const ds = getDirectories(dataDir)
  for (let i = 0; i < ds.length; i++) {
    const d = ds[i]
    const infos = JSON.parse(fs.readFileSync(path.join(dataDir, d, 'infos.json')))
    await addToRaw(
      infos,
      path.resolve(path.join(dataDir, d, 'whites')),
      path.resolve(path.join(dataDir, d, 'blacks'))
    )
    console.log(d, ' added')
  }

  fs.writeFileSync(path.resolve(path.join(dataDir, 'raw.json')), JSON.stringify(rawDecks))
  console.log('raw.json written')
}

processing()
