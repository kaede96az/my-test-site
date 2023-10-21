export const SelectTileColor = (title: string): string => {
  switch (title) {
    case '副反応疑い':
      return 'yellow-lighten-3'
    case '副反応':
      return 'orange-darken-1'
    case '重篤':
      return 'deep-orange-darken-1'
    case '死亡':
      return '#c83f3d'

    default:
      return 'orange-accent-1'
  }
}