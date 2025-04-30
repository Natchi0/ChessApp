<script setup lang="ts">
import { computed } from 'vue';
import { PieceImage } from '@/logic/PieceImage';


const props = defineProps<{
  color: boolean
  piece?: number
}>()

const pieceImage = PieceImage.GetInstance();

const pieceSrc = computed(() => {
  if (props.piece === 0 || props.piece === undefined) {
    return '';
  }

  return pieceImage.getSource(props.piece);
});

</script>

<template>
  <div class="h-full w-full text-black flex justify-center items-center" :class="[{'bg-orange-200': props.color},{'bg-yellow-900': !props.color}]">
    <img :src="pieceSrc" alt="">
  </div>
</template>
