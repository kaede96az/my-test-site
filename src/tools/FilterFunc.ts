import type { ShallowRef } from 'vue'

const nullOrEmptyString = (value: any): boolean => {
  return value == '' || value == null
}

export const StringFilterFunc = (value: string, filterVal: ShallowRef<string>): boolean => {
  // フィルタリング処理が不要な場合はtrueを返すことで、項目を表示させる
  if (nullOrEmptyString(filterVal.value)) return true

  //todo
  //return value.indexOf(filterVal.value) > -1
  if(value.indexOf(filterVal.value) > -1){
    return true
  } else {
    return false
  }
}

export const StringArrayFilterFunc = (values: string[], filterVal: ShallowRef<string>): boolean => {
  if (nullOrEmptyString(filterVal.value)) return true

  // 検索文字列がある場合にくる。検索対象が空なら該当しないのでfalseを返す。
  if(values.length == 0) return false

  for (let index = 0; index < values.length; index++) {
    if(values[index].indexOf(filterVal.value) > -1) return true
  }

  return false
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

  if (!nullOrEmptyString(fromFilterVal.value)) {
    const f = Number(fromFilterVal.value)
    // フィルターの値(from)よりも小さな数ならば非表示にする。フィルターの値(from)と同じ数値は表示する。
    if (v < f) {
      return false
    }
  }
  if (!nullOrEmptyString(toFilterVal.value)) {
    const t = Number(toFilterVal.value)
    // フィルターの値(to)よりも大きな数ならば非表示にする。フィルターの値(to)と同じ数値は表示する。
    if (t < v) {
      return false
    }
  }
  return true
}

export const NumberArrayFilterFunc = (
  values: number[],
  fromFilterVal: ShallowRef<number>,
  toFilterVal: ShallowRef<number>
): boolean => {
  // フィルタリング処理が不要な場合はtrueを返すことで、項目を表示させる
  if (nullOrEmptyString(fromFilterVal.value) && nullOrEmptyString(toFilterVal.value)) return true
  if (values.length == 0) return false

  let result = false
  if (!nullOrEmptyString(fromFilterVal.value)) {
    result = false
    // フィルターの値(from)よりも小さな数ならば非表示にする。フィルターの値(from)と同じ数値は表示する。
    for (let index = 0; index < values.length; index++) {
      if( fromFilterVal.value <= values[index]) result = true
    }
    if (!result) return false
  }

  if (!nullOrEmptyString(toFilterVal.value)) {
    result = false
    // フィルターの値(to)よりも大きな数ならば非表示にする。フィルターの値(to)と同じ数値は表示する。
    for (let index = 0; index < values.length; index++) {
      if( values[index] <= toFilterVal.value) result = true
    }
    if (!result) return false
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

  const vDate = new Date(value)
  // パースに失敗した場合は、日付としての比較ができないため非表示にする
  if (isNaN(vDate.getTime())) return false

  if (!nullOrEmptyString(fromFilterVal.value)) {
    const fDate = new Date(fromFilterVal.value)
    // フィルターの日付(from)よりも前の日付ならば非表示にする。フィルターの日付(from)と同じ日は表示する。
    if (compareDate(vDate, fDate)) {
      return false
    }
  }
  if (!nullOrEmptyString(toFilterVal.value)) {
    const tDate = new Date(toFilterVal.value)
    // フィルターの日付(to)よりも後の日付ならば非表示にする。フィルターの日付(to)と同じ日は表示する。
    if (compareDate(tDate, vDate)) {
      return false
    }
  }
  return true
}

// toDateの方が、より後の日付ならtrueを返す。
// fromDateとtoDateが同じ日付の場合や、fromDateの方がより後の日付ならfalseを返す。
const compareDate = (fromDate: Date, toDate: Date): boolean => {
  return fromDate.getTime() < toDate.getTime()
}