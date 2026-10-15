export const chapters = [
  {
    label: 'Arrival',
    title: 'A house for art.',
    description: 'Sun on plaster. A glimpse of green. A little room to slow down.',
  },
  {
    label: 'The room',
    title: 'Stay a little longer.',
    description:
      'Timber, terracotta, and one remarkable work. A gallery imagined in the spirit of Bhaktapur.',
  },
  {
    label: 'The work',
    title: 'A closer way to see.',
    description:
      'Eleven faces. A thousand arms. Follow the details of Avalokiteshvara in the original photograph.',
  },
] as const

type Vector = [number, number, number]
const stops: { position: Vector; target: Vector; fov: number }[] = [
  { position: [-1.9, 1.72, 3.1], target: [0.45, 1.45, -2.05], fov: 60 },
  { position: [-0.65, 1.7, 1.55], target: [0, 1.55, -3.75], fov: 54 },
  { position: [0, 1.55, -1.7], target: [0, 1.55, -3.82], fov: 50 },
]

export function journeyFrame(progress: number, reducedMotion = false) {
  const value = Math.max(0, Math.min(2, Number.isFinite(progress) ? progress : 0))
  if (reducedMotion) return stops[Math.round(value)]
  const index = Math.min(1, Math.floor(value))
  const fraction = value - index
  const t = fraction * fraction * (3 - 2 * fraction)
  const start = stops[index],
    end = stops[index + 1]
  const blend = (a: Vector, b: Vector): Vector => [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ]
  return {
    position: blend(start.position, end.position),
    target: blend(start.target, end.target),
    fov: start.fov + (end.fov - start.fov) * t,
  }
}
