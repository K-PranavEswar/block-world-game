export function timeRating(time) {
  if (time <= 120) return "Unstoppable 🏆"
  if (time <= 240) return "Panda 🐼"
  if (time <= 360) return "Slow but Steady 🐢"
  return "Keep Practicing"
}
