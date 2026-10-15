import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createRoot, _roots, advance } from '@react-three/fiber'
import { createRequire } from 'node:module'
const { Timer } = createRequire(import.meta.url)('three')

function fixture(t) {
  let now = 1000
  t.mock.method(performance, 'now', () => now)
  const warnings = t.mock.method(console, 'warn', () => {})
  const canvas = {}
  createRoot(canvas)
  const { store } = _roots.get(canvas)
  store.setState({ gl: { render() {}, xr: { isPresenting: false } } })
  t.after(() => _roots.delete(canvas))
  return {
    store,
    clock: store.getState().clock,
    warnings,
    tick: (ms) => {
      now += ms
    },
  }
}

test('Fiber creates a Timer-backed clock without deprecation warnings', (t) => {
  const { clock, warnings } = fixture(t)
  assert.ok(clock.timer instanceof Timer)
  assert.equal(warnings.mock.callCount(), 0)
  assert.equal(clock.getDelta(), 0)
})

test('frame deltas and elapsed animation time remain in seconds', (t) => {
  const { clock, tick } = fixture(t)
  clock.start()
  tick(16)
  assert.equal(clock.getDelta(), 0.016)
  tick(34)
  assert.equal(clock.getDelta(), 0.034)
  assert.equal(clock.getElapsedTime(), 0.05)
  tick(50)
  assert.equal(clock.getElapsedTime(), 0.1)
})

test('stop freezes time and start resets without including the pause', (t) => {
  const { clock, tick } = fixture(t)
  clock.start()
  tick(100)
  clock.stop()
  tick(5000)
  assert.equal(clock.getDelta(), 0)
  assert.equal(clock.getElapsedTime(), 0.1)
  clock.start()
  assert.equal(clock.elapsedTime, 0)
  tick(20)
  assert.equal(clock.getDelta(), 0.02)
})

test('Fiber manual advance and demand-loop restart preserve their timing contract', (t) => {
  const { store, clock, tick } = fixture(t)
  store.getState().setFrameloop('never')
  advance(1, false, store.getState())
  advance(1.5, false, store.getState())
  assert.equal(clock.elapsedTime, 1.5)
  assert.equal(clock.oldTime, 1)
  store.getState().setFrameloop('demand')
  assert.equal(clock.elapsedTime, 0)
  assert.equal(clock.running, true)
  tick(25)
  assert.equal(clock.getDelta(), 0.025)
})
