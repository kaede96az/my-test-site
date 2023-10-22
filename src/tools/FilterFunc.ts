import type { ShallowRef } from 'vue'

export const StringFilterFunc = (value: string, filterVal: ShallowRef<string>): boolean => {
  if (nullOrEmptyString(filterVal.value)) return true
  return value.indexOf(filterVal.value) > -1
}

const nullOrEmptyString = (value: string): boolean => {
  return value == '' || value == null
}

export const AgeFilterFunc = (
  value: string,
  fromFilterVal: ShallowRef<string>,
  toFilterVal: ShallowRef<string>
): boolean => {
  const v = Number(value)
  // コメントがついているなど数字に変換できないデータの場合は、数字による大小比較が
  // 困難なためフィルタリング時に「非表示」にする
  if (isNaN(v)) return false

  if (fromFilterVal.value != '') {
    const f = Number(fromFilterVal.value)
    if (v <= f) {
      return false
    }
  }
  if (toFilterVal.value != '') {
    const t = Number(toFilterVal.value)
    if (v >= t) {
      return false
    }
  }
  return true
}

export const DateFilterFunc = (
  value: string,
  fromFilterVal: ShallowRef<string>,
  toFilterVal: ShallowRef<string>
): boolean => {
  // 改行を含むデータの場合、最初の日付データだけを使ってフィルタリング処理を行う。
  const firstVal = value.split('\n')[0]
  const v = new Date(firstVal)
  // 「不明」の場合など「YYYY/MM/DD」形式でない場合は、Date型に変換しての比較が
  // できないためフィルタリング時に「非表示」にする
  if (isNaN(v.getTime())) return false

  if (fromFilterVal.value != null) {
    const f = new Date(fromFilterVal.value)
    if (v <= f) {
      return false
    }
  }
  if (toFilterVal.value != null) {
    const f = new Date(toFilterVal.value)
    if (v >= f) {
      return false
    }
  }
  return true
}
