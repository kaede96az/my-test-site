import { DateFilterFunc, NumberFilterFunc, StringFilterFunc } from "@/tools/FilterFunc"
import { shallowRef, type ShallowRef } from "vue"

export interface IKeyAndFilter {
	key: string
	filterType: FilterType
	valFilter: ShallowRef<string>
	fromFilter: ShallowRef<string>
	toFilter: ShallowRef<string>
}

export enum FilterType {
	String = 0,
	Number = 1,
	Date = 2
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
		filteredData.value = filteredData.value?.filter( (item: any): boolean => {
			const value = item[kf.key] as string
			if(value == undefined) return false

			switch (kf.filterType) {
				case FilterType.String:
					return StringFilterFunc(value, kf.valFilter)
				case FilterType.Number:
					return NumberFilterFunc(value.replaceAll('回目', ''), kf.fromFilter, kf.toFilter)
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

export const CreateCsvContent = <T>(filteredData: ShallowRef<T[] |undefined> ,headerTitles: string, headerKeys: string[]): string => {
	const lineArray: string[] = [headerTitles]
	filteredData.value?.forEach( (row: any) => {
		let csvRow = ""
		let isFirstItem = true
		headerKeys.forEach(key => {
			if(isFirstItem){
				isFirstItem=false
				csvRow = '"' + row[key] + '"'
			} else {
				csvRow = csvRow + ',' + '"' + row[key] + '"'
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