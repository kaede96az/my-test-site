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
  if(fromDate.getFullYear() === toDate.getFullYear() &&
  fromDate.getMonth() === toDate.getMonth() &&
  fromDate.getDay() === toDate.getDay()) return false

  // 以下の比較演算子による比較だと、同日として文字列から作ったDate型の比較がイコール
  // にならないため、上記の処理が必要。
  return fromDate < toDate
}