'use strict'

/* eslint-disable camelcase */

const { nameOptimizationState } = require('./optimization-state')
const {
    parseIcState
  , severityIcState
} = require('./ic-state')

function normalizeFile(file) {
  // Node.js adds :line:column to the end
  return file.split(':')[0]
}

function unquote(s) {
  // for some reason Node.js double quotes the file names
  return s.replace(/^"/, '').replace(/"$/, '')
}

class IcEntry {
  constructor(
      type
    , fnFile
    , line
    , column
    , key
    , oldState
    , newState
    , map
    , reason
    , state
  ) {
    this.type = type

    fnFile = unquote(fnFile)
    const parts = fnFile.split(' ')
    const functionName = parts[0]
    const file = normalizeFile(parts[1])
    const optimizationState = nameOptimizationState(state)

    this.functionName = functionName
    this.file = file
    this.line = line
    this.column = column

    this.oldState = parseIcState(oldState)
    this.newState = parseIcState(newState)

    this.key = key
    this.map = map.toString(16)
    this.reason = reason
    this.optimizationState = optimizationState
    this.severity = severityIcState(this.newState)
  }

  get category() {
    if (this.type.indexOf('Store') !== -1) {
      return 'Store'
    } else if (this.type.indexOf('Load') !== -1) {
      return 'Load'
    } else {
      return 'other'
    }
  }

  get hashmap() {
    return {
        functionName : this.functionName
      , file         : this.file
      , line         : this.line
      , column       : this.column
      , oldState     : this.oldState
      , newState     : this.newState
      , key          : this.key
      , map          : this.map
      , reason       : this.reason
      , additional   : this.additional
      , severity     : this.severity
    }
  }
}

module.exports = IcEntry