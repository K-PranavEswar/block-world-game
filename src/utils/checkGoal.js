export function checkGoal(current, goal) {
  if (current.length !== goal.length) return false

  for (let i = 0; i < current.length; i++) {
    if (current[i].length !== goal[i].length) return false

    for (let j = 0; j < current[i].length; j++) {
      if (current[i][j] !== goal[i][j]) return false
    }
  }

  return true
}
