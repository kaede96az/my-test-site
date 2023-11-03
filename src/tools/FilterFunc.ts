import type { ShallowRef } from 'vue'

const nullOrEmptyString = (value: string): boolean => {
  return value == '' || value == null
}

export const StringFilterFunc = (value: string, filterVal: ShallowRef<string>): boolean => {
  // フィルタリング処理が不要な場合はtrueを返すことで、項目を表示させる
  if (nullOrEmptyString(filterVal.value)) return true

  return value.indexOf(filterVal.value) > -1
}

export const NumberFilterFunc = (
  value: string,
  fromFilterVal: ShallowRef<string>,
  toFilterVal: ShallowRef<string>
): boolean => {
  // フィルタリング処理が不要な場合はtrueを返すことで、項目を表示させる
  if (nullOrEmptyString(fromFilterVal.value) && nullOrEmptyString(toFilterVal.value)) return true

  const v = Number(value)
  // コメントがついているなど数字に変換できないデータの場合は、数字による大小比較が
  // 困難なためフィルタリング時に「非表示」にする
  if (isNaN(v)) return false

  if (fromFilterVal.value != '') {
    const f = Number(fromFilterVal.value)
    // フィルターの値(from)よりも小さな数ならば非表示にする。フィルターの値(from)と同じ数値は表示する。
    if (v < f) {
      return false
    }
  }
  if (toFilterVal.value != '') {
    const t = Number(toFilterVal.value)
    // フィルターの値(to)よりも大きな数ならば非表示にする。フィルターの値(to)と同じ数値は表示する。
    if (t < v) {
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
  // フィルタリング処理が不要な場合はtrueを返すことで、項目を表示させる
  if (nullOrEmptyString(fromFilterVal.value) && nullOrEmptyString(toFilterVal.value)) return true

  const v: [Date, boolean] = tryParseDate(value)
  // パースに失敗した場合は、日付としての比較ができないため非表示にする
  if (!v[1]) return false

  if (fromFilterVal.value != '' && fromFilterVal.value != null) {
    const f = new Date(fromFilterVal.value)
    if (v[0] <= f) {
      return false
    }
  }
  if (toFilterVal.value != '' && toFilterVal.value != null) {
    const f = new Date(toFilterVal.value)
    if (v[0] >= f) {
      return false
    }
  }
  return true
}

const tryParseDate = (value: string): [data: Date, result: boolean] => {
  const splitters = ['\n', '、', ',']
  splitters.forEach((s) => {
    const data = new Date(value.split(s)[0])
    if (!isNaN(data.getTime())) return [data, true]
  })

  return [new Date(), false]
}
