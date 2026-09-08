// Shared room geometry constants — the shell, lights, rig, and hotspot must
// agree on these. All units are meters; the room is centered on the origin
// with the floor at y=0 and the focal (painting) wall at -Z.

export const ROOM_WIDTH = 6 // X
export const ROOM_DEPTH = 8 // Z
export const ROOM_HEIGHT = 3.5 // Y

export const EYE_HEIGHT = 1.6
export const PLAYER_RADIUS = 0.35

// Painting: ~0.93m × 1.4m, eye-level center, flush on the -Z wall.
export const PAINTING_WIDTH = 0.93
export const PAINTING_HEIGHT = 1.4
export const PAINTING_CENTER_Y = 1.55
export const PAINTING_Z = -ROOM_DEPTH / 2 + 0.18

// Where the camera should stand to view the painting (also the target of the
// reduced-motion / keyboard "View painting" path). Must be INSIDE the
// inspect-enter radius so arriving here always reveals the label + CTA.
export const INSPECT_POSITION: [number, number, number] = [0, EYE_HEIGHT, PAINTING_Z + 1.7]
export const INSPECT_LOOKAT: [number, number, number] = [0, PAINTING_CENTER_Y, PAINTING_Z]

// Mesh names shared between ThangkaWall (assigns) and FirstPersonRig
// (raycasts for tap-to-walk).
export const FLOOR_MESH_NAME = 'room-floor'
export const PAINTING_GROUP_NAME = 'thangka-painting'
export const PAINTING_MESH_NAME = 'thangka-canvas'

// Walkable AABB. X and +Z are inset by the player radius; the focal wall
// (-Z) gets a larger 0.7m inset so the camera can never clip the frame.
export const BOUNDS = {
  minX: -ROOM_WIDTH / 2 + PLAYER_RADIUS,
  maxX: ROOM_WIDTH / 2 - PLAYER_RADIUS,
  minZ: -ROOM_DEPTH / 2 + 0.7,
  maxZ: ROOM_DEPTH / 2 - PLAYER_RADIUS,
}

// Inspect proximity (with hysteresis so the overlay doesn't flicker at the
// threshold).
export const INSPECT_ENTER_DISTANCE = 1.8
export const INSPECT_EXIT_DISTANCE = 2.4

// Where the player spawns: south end, facing the painting (-Z).
export const SPAWN_POSITION: [number, number, number] = [0, EYE_HEIGHT, 3.2]
