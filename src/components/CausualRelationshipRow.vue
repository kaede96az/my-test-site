<template>
	<div v-if="SplitWithArrow(CR).length > 1">
		<div v-if="SplitWithArrow(CR)[0].length >= strCount">
			<CrChip :CR="SplitWithArrow(CR)[0]" :inverse=false v-if="isExpanded(item)"></CrChip>
			<CrChip :CR="SplitWithArrow(CR)[0].substring(0, splitPos) + '...'" :inverse=false v-else></CrChip>
		</div>
		<div v-else>
			<CrChip :CR="SplitWithArrow(CR)[0]" :inverse=false v-if="isExpanded(item)"></CrChip>
			<CrChip :CR="SplitWithArrow(CR)[0] + '...'" :inverse=false v-else></CrChip>
		</div>
	</div>
	<div v-else>
		<div v-if="CR.length >= strCount">
			<CrChip :CR="CR" v-if="isExpanded(item)" :inverse=false></CrChip>
			<CrChip :CR="CR.substring(0, splitPos) + '...'" :inverse=false v-else></CrChip>
		</div>
		<div v-else>
			<CrChip :CR="CR" :inverse=false></CrChip>
		</div>
	</div>
</template>

<script setup lang="ts">
import {SplitWithArrow} from '@/tools/SplitData'
import CrChip from '@/components/CertifiedRelationChip.vue'

const strCount = 12
const splitPos = 7

defineProps<{
  item: any
  CR: string
  isExpanded: (item: any) => boolean
}>()
</script>