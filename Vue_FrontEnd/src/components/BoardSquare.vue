<script setup lang="ts">
import { computed } from 'vue';
import { PieceImage } from '@/logic/PieceImage';


const props = defineProps<{
  color: boolean
  piece?: number
  highlighted?: boolean
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
  <div class="h-full w-full text-black relative flex justify-center items-center" :class="[{'bg-orange-200': props.color},{'bg-yellow-900': !props.color}]">

    <div class="hover:scale-110 transition-all duration-200 back">
      <img :src="pieceSrc" alt="" />
    </div>

    <div class="w-full h-full absolute" :class="{'possible-move': highlighted}"/>

    <div class="absolute top-0 right-0">
      <slot></slot>
    </div>

  </div>
</template>

<style scoped>
.possible-move{
  background-color: rgba(225, 255, 0, 0.6);
}

.possible-move:hover{
  background-color: rgba(200, 255, 0, 0.9);
  cursor: pointer;
}

</style>
