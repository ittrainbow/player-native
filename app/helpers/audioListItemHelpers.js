export const getListItemText = (filename = ' ') => {
  const letterNum = /[a-zA-Zа-яА-Я]/i.exec(filename).index

  const letter = filename.charAt(letterNum).toUpperCase()
  const trackname = filename.replace('.mp3', '').substring(letterNum)

  return { letter, trackname }
}

export const getListItemTime = (duration) => {
  const minutes = Math.floor(duration / 60)
  const seconds = Math.floor(duration) - 60 * minutes
  const leadZero = (val) => (val < 9 ? '0' : '')
  const time = `${leadZero(minutes)}${minutes}:${leadZero(seconds)}${seconds}`

  return time
}