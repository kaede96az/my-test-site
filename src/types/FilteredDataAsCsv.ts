import { shallowRef, type ShallowRef } from "vue"

export interface IKeyAndFilter {
	key: string
	filter: ShallowRef<string>
}

export const CreateFilteredData = <T>(keyFilters: IKeyAndFilter[], tableData: ShallowRef<T[] | undefined> | undefined): ShallowRef<T[] | undefined> => {
	if(tableData == undefined) {
		console.log('failed to create csv: tableData is undefined')
		return shallowRef<T[]>([])
	}

	const filteredData = tableData
	keyFilters.forEach(kf => {
		filteredData.value = filteredData.value?.filter( (item: any): boolean => {
			if(isNotNullEmpty(kf.filter)){
				if(item[kf.key].indexOf(kf.filter.value) < 0) return false
			}
			return true
		})
	});
	
	if(filteredData == undefined) {
		console.log('failed to create csv: filteredData is undefined')
		return shallowRef<T[]>([])
	}

	return filteredData
}

const isNotNullEmpty = (val: ShallowRef<string>): boolean => {
  return val.value != '' && val.value != null
}

export const CreateCsvContent = <T>(filteredData: ShallowRef<T[] |undefined> ,headerTitles: string, headerKeys: string[]): string => {
	const lineArray: string[] = [headerTitles]
	filteredData.value?.forEach( (row: any) => {
		let csvRow = ""
		let isFirstItem = true
		headerKeys.forEach(key => {
			if(isFirstItem){
				isFirstItem=false
				csvRow = row[key]
			} else {
				csvRow = csvRow + ',' + row[key]
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