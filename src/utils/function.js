export const getDayNightCount = dates => {
  if (dates[1] == null) {
    return
  }

  const date1 = new Date(dates[0])
  const date2 = new Date(dates[1])

  const diffInMs = date2 - date1

  const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
  return diffInDays
}
