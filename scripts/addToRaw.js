const lineReader = require('line-reader')
const path = require('path')
const util = require('util')
const fs = require('fs')

// node script/addToRaw <file_name_white_card> <file_name_black_card> <deckname> <deckcode>

const fWhites = path.resolve(process.argv[2])
const fBlacks = path.resolve(process.argv[3])
const deckCode = process.argv[4]
const deckName = process.argv[5]

const pathRaw = '../games/raw.json'

const rawDecks = require(pathRaw)

const printRaw = () => {
  console.log('Black cards length: ', rawDecks.blackCards.length)
  console.log('1st black card: ', rawDecks.blackCards[0].text)
  console.log('Last black card: ', rawDecks.blackCards[rawDecks.blackCards.length - 1].text)
  console.log('White cards length: ', rawDecks.whiteCards.length)
  console.log('1st white card: ', rawDecks.whiteCards[0])
  console.log('Last white card: ', rawDecks.whiteCards[rawDecks.whiteCards.length - 1])
  console.log('Order: ', rawDecks.order.length)
  console.log('Keys: ', Object.keys(rawDecks).length)
}
printRaw()

const eachLine = util.promisify(lineReader.eachLine)

async function addToRaw () {
  const whiteCards = []
  await eachLine(fWhites, line => {
    if (line && line !== '') {
      whiteCards.push(line)
    }
  })

  const blackCards = []
  await eachLine(fBlacks, line => {
    if (line && line !== '') {
      blackCards.push({ text: line })
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
  rawDecks[deckCode] = {
    name: deckName,
    black: blackIdx,
    white: whiteIdx
  }
  rawDecks.order.push(deckCode)

  console.log('New black cards: ', blackCards.length)
  console.log('New white cards: ', whiteCards.length)
  printRaw()

  console.log('rawDecks.blackCards[rawDecks[deckCode].black[0]]: ', rawDecks.blackCards[rawDecks[deckCode].black[0]])
  console.log('rawDecks.blackCards[rawDecks[deckCode].black[rawDecks[deckCode].black.length - 1]]: ', rawDecks.blackCards[rawDecks[deckCode].black[rawDecks[deckCode].black.length - 1]])
  console.log('rawDecks.whiteCards[rawDecks[deckCode].white[0]]: ', rawDecks.whiteCards[rawDecks[deckCode].white[0]])
  console.log('rawDecks.whiteCards[rawDecks[deckCode].white[rawDecks[deckCode].white.length - 1]]: ', rawDecks.whiteCards[rawDecks[deckCode].white[rawDecks[deckCode].white.length - 1]])
  fs.writeFileSync('newRaw.json', JSON.stringify(rawDecks))
}

addToRaw()
