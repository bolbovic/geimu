const lineReader = require('line-reader')
const path = require('path')

const f = path.resolve(process.argv[2])

lineReader.eachLine(f, line => {
  console.log(line)
})
