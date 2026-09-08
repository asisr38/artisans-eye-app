/** Native browsers may throw, reject a promise, or use the legacy void API. */
export async function requestPointerLockSafely(
  element: { requestPointerLock?: () => Promise<void> | void },
  onFailure: () => void,
): Promise<void> {
  try {
    if (!element.requestPointerLock) {
      onFailure()
      return
    }
    await element.requestPointerLock()
  } catch {
    onFailure()
  }
}
