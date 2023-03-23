export const getTrackNames = (uri) => {
  const filename = uri.split('/')
  const length = filename.length - 1
  const file = filename[length].replace('.mp3', '').replace('_', ' ').split(' - ')

  return { artist: file[0], title: file[1] }
}