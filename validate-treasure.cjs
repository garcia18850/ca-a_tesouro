const fs = require('node:fs')
const vm = require('node:vm')
const assert = require('node:assert/strict')
const { stripTypeScriptTypes } = require('node:module')
const context = vm.createContext({})
const source = fs.readFileSync('lib/treasure.ts', 'utf8').replace(/export /g, '')
vm.runInContext(stripTypeScriptTypes(source + '\nglobalThis.api = {treasureStops,treasureClues,CLUES_PER_STOP,newTreasureProgress,readTreasureProgress,parseTreasureProgress,openTreasureStop,chooseTreasureAnswer,confirmTreasureAnswer,continueTreasureMap};'), context)
const api = context.api
assert.equal(api.treasureStops.length, 5)
assert.equal(api.CLUES_PER_STOP, 3)
assert.equal(api.treasureClues.length, 15)
assert.equal(new Set(api.treasureClues.map(clue => clue.id)).size, 15)
for (const clue of api.treasureClues) {
  assert.equal(clue.options.length, 3)
  assert.equal(new Set(clue.options).size, 3)
  assert(clue.options.includes(clue.answer))
  assert(clue.prompt && clue.hint)
  assert(clue.prompt.length < 145, 'Keep clues brief: ' + clue.id)
}
let state = api.newTreasureProgress()
assert.equal(api.openTreasureStop(state, 'tesouro'), state, 'Cannot skip to the treasure')
assert.equal(api.confirmTreasureAnswer(state).correct, false)
for (let stop = 0; stop < 5; stop++) {
  assert.equal(state.screen, 'map')
  assert.equal(state.step, stop * 3)
  state = api.openTreasureStop(state, api.treasureStops[stop].id)
  assert.equal(state.screen, 'question')
  for (let question = 0; question < 3; question++) {
    const clue = api.treasureClues[state.step]
    const previousStep = state.step
    assert.equal(api.chooseTreasureAnswer(state, 'not an option'), state)
    assert.equal(api.confirmTreasureAnswer(state).correct, false, 'Empty answer cannot advance')
    const wrong = clue.options.find(option => option !== clue.answer)
    const incorrect = api.confirmTreasureAnswer(api.chooseTreasureAnswer(state, wrong))
    assert.equal(incorrect.correct, false)
    assert.equal(incorrect.progress.step, previousStep, 'An incorrect answer must not consume a clue')
    state = api.chooseTreasureAnswer(state, clue.answer)
    assert.equal(state.step, previousStep, 'Selection and voice recognition cannot auto-submit')
    state = api.parseTreasureProgress(JSON.stringify(state))
    assert.equal(state.choice, clue.answer, 'Unconfirmed choice resumes')
    const result = api.confirmTreasureAnswer(state)
    assert.equal(result.correct, true)
    state = result.progress
    assert.equal(state.step, previousStep + 1)
    assert.equal(state.choice, null)
    assert.equal(api.confirmTreasureAnswer(state).correct, false, 'Repeated confirmation cannot skip a clue')
    state = api.parseTreasureProgress(JSON.stringify(state))
    assert.equal(state.step, previousStep + 1, 'Confirmed checkpoint resumes')
  }
  if (stop < 4) {
    assert.equal(state.screen, 'found')
    assert.equal(api.openTreasureStop(state, api.treasureStops[stop + 1].id), state, 'The map fragment is shown before the next stop')
    state = api.continueTreasureMap(state)
  }
}
assert.equal(state.screen, 'complete')
assert.equal(state.step, 15)
assert.equal(api.continueTreasureMap(state), state)
for (const invalid of [null, {}, {version: 2,step: 3,screen: 'map'}, {version: 1,step: -1,screen: 'question'}, {version: 1,step: 16,screen: 'complete'}, {version: 1,step: 1,screen: 'map'}, {version: 1,step: 2,screen: 'found'}, {version: 1,step: 0,screen: 'found'}]) assert.equal(api.readTreasureProgress(invalid).step, 0)
assert.equal(api.parseTreasureProgress('not-json').screen, 'map', 'Corrupted storage recovers safely')
assert.equal(api.parseTreasureProgress(null).step, 0)
assert.equal(api.readTreasureProgress({version: 1,step: 2,screen: 'question',choice: '<script>'}).choice, null)
console.log('Treasure adventure verified: 5 stops, 15 short clues, 3 distinct options, no skipped stops, no accidental/double submission, retries, checkpoints, map fragments, final treasure and corrupted-storage recovery.')
