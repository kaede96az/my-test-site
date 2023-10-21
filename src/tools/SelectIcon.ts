export const SelectIcon = (title: string): string => {
  switch (title) {
    case '副反応疑い':
    case '副反応':
      return 'mdi-message-alert'
    case '重篤':
      return 'mdi-account-alert'
    case '死亡':
      return 'mdi-heart-off'

    default:
      return 'mdi-info'
  }
}
