export function generateInitialState() {
  const colors = ["red", "blue", "green", "yellow"]
  const tubesCount = 4
  const blocksPerColor = 2

  let blocks = []
  colors.forEach(color => {
    for (let i = 0; i < blocksPerColor; i++) {
      blocks.push(color)
    }
  })

  for (let i = blocks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[blocks[i], blocks[j]] = [blocks[j], blocks[i]]
  }

  const tubes = Array.from({ length: tubesCount }, () => [])

  blocks.forEach((block, index) => {
    tubes[index % tubesCount].push(block)
  })

  return tubes
}

export function generateGoalState(initial) {
  const flat = initial.flat()
  const unique = [...new Set(flat)]
  const tubes = []

  unique.forEach(color => {
    tubes.push(flat.filter(b => b === color))
  })

  while (tubes.length < initial.length) {
    tubes.push([])
  }

  return tubes
}
