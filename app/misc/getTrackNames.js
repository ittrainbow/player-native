export const getTrackNames = (uri) => {
  const file = uri.split('mp3/')[1].replace('.mp3', '').replace('_', ' ').split(' - ')
  const artist = file[0]
  const title = file[1]

  return { artist, title }
}