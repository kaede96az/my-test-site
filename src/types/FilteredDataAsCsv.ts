import { DateFilterFunc, NumberArrayFilterFunc, NumberFilterFunc, StringArrayFilterFunc, StringFilterFunc } from "@/tools/FilterFunc"
import { shallowRef, type ShallowRef } from "vue"

export interface IKeyAndFilter {
	key: string
	filterType: FilterType
	valFilter: ShallowRef<string>
	fromFilter: ShallowRef<any>
	toFilter: ShallowRef<any>
}

export enum FilterType {
	String = 0,
	StringArray = 1,
	Number = 2,
	NumberArray = 3,
	Date = 4
}

export const CreateFilteredData = <T>(keyFilters: IKeyAndFilter[], tableData: ShallowRef<T[] | undefined> | undefined): ShallowRef<T[] | undefined> => {
	if(tableData == undefined) {
		console.log('failed to create csv: tableData is undefined')
		return shallowRef<T[]>([])
	}

	// const filteredData = tableData というように、直接tableDataの参照を使ってはいけない。
	// 元データをいじることになってしまうため、検索条件をクリアしても、表示件数が少ないままになってしまう。
	const filteredData = shallowRef<T[] | undefined>([])
	filteredData.value = tableData.value
	keyFilters.forEach(kf => {
		let val: string = ''
		filteredData.value = filteredData.value?.filter( (item: any): boolean => {
			const value = getValueFromCompexKey(item, kf.key)
			if(value == undefined) return false

			switch (kf.filterType) {
				case FilterType.String:
					return StringFilterFunc(value, kf.valFilter)
				case FilterType.StringArray:
					return StringArrayFilterFunc(value, kf.valFilter)
				case FilterType.Number:
					val = value
					if(typeof(val) == typeof('')){
						val = val.replaceAll('回目', '')
					}
					return NumberFilterFunc(val, kf.fromFilter, kf.toFilter)
				case FilterType.NumberArray:
					return NumberArrayFilterFunc(value, kf.fromFilter, kf.toFilter)
				case FilterType.Date:
					return DateFilterFunc(value, kf.fromFilter, kf.toFilter)
			
				default:
					break;
			}
			
			return true
		})
	});
	
	return filteredData
}

// counts.sum のようにデータが階層構造（countsオブジェクト内のsumプロパティ）でkeyを指定して
// いるようなケースに対応するため、専用の抽出処理を行う
const getValueFromCompexKey = (item: any, key: string): any => {
	const keys = key.split('.')
	let result = item[keys[0]]
	for (let index = 1; index < keys.length; index++) {
		result = result[keys[index]]
	}
	return result
}

export const CreateCsvContent = <T>(filteredData: ShallowRef<T[] |undefined> ,headerTitles: string, headerKeys: string[]): string => {
	const lineArray: string[] = [headerTitles]
	filteredData.value?.forEach( (row: any) => {
		let csvRow = ""
		let isFirstItem = true
		headerKeys.forEach(key => {
			const data = getValueFromCompexKey(row, key)
			if(isFirstItem){
				isFirstItem=false
				csvRow = '"' + data + '"'
			} else {
				csvRow = csvRow + ',' + '"' + data + '"'
			}
		});
		lineArray.push(csvRow);
	});

	return lineArray.join("\n");
}

export const DownloadCsvFile = (fileName: string, csvContent: string) => {
	const bom = new Uint8Array([0xef, 0xbb, 0xbf])
	const blob = new Blob([bom, csvContent], { type: "text/csv" })

	const link = document.createElement('a')
	link.download = fileName
	link.href = URL.createObjectURL(blob)
	link.click()

	URL.revokeObjectURL(link.href)
}