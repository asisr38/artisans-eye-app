import { test } from 'node:test'
import assert from 'node:assert/strict'
import { requestPointerLockSafely } from '../components/3d/room/requestPointerLock.ts'

test('invokes the native API synchronously within the user gesture', async () => {
  let called = false
  const element = {
    requestPointerLock() {
      assert.equal(this, element)
      called = true
    },
  }
  const pending = requestPointerLockSafely(element, () => assert.fail('unexpected fallback'))
  assert.equal(called, true)
  await pending
})

test('handles both thrown errors and rejected browser promises', async () => {
  for (const requestPointerLock of [
    () => {
      throw new Error('blocked')
    },
    () => Promise.reject(new Error('Chromium refused pointer lock')),
  ]) {
    let failures = 0
    await requestPointerLockSafely({ requestPointerLock }, () => {
      failures++
    })
    assert.equal(failures, 1)
  }
})

test('falls back when unavailable and accepts successful promise API', async () => {
  let failures = 0
  await requestPointerLockSafely({}, () => {
    failures++
  })
  assert.equal(failures, 1)
  await requestPointerLockSafely({ requestPointerLock: () => Promise.resolve() }, () =>
    assert.fail('unexpected fallback'),
  )
})
