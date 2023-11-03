<template>
	<div v-if="SplitWithSemicolon(bd).length > 1">
		<div v-if="SplitWithSemicolon(bd)[0].length >= 10">
			<span v-if="isExpanded(item)">{{ SplitWithSemicolon(bd)[0] }}</span>
			<span v-else>{{ SplitWithSemicolon(bd)[0].substring(0, 7) + '...' }}</span>
		</div>
		<div v-else>
			<span v-if="isExpanded(item)">{{ SplitWithSemicolon(bd)[0] }}</span>
			<span v-else>{{ SplitWithSemicolon(bd)[0] + '...' }}</span>
		</div>
    </div>
	<div v-else>
		<div v-if="bd.length >= 10">
			<span v-if="isExpanded(item)">{{ bd }}</span>
			<span v-else>{{ bd.substring(0, 7) + '...' }}</span>
		</div>
		<div v-else>{{ bd }}</div>
	</div>
</template>

<script setup lang="ts">
import {SplitWithSemicolon} from '@/tools/SplitData'

defineProps<{
  item: any
  bd: string
  isExpanded: (item: any) => boolean
}>()
</script>