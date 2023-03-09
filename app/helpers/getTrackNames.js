export const getTrackNames = (filename) => {
  const file = filename.replaceAll('.mp3', '').replaceAll('_', ' ').split(' - ')
  return { artist: file[0], title: file[1] }
}