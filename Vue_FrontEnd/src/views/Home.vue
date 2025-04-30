<script setup lang="ts">
import { ref } from 'vue';
import BasicButton from '@/components/BasicButton.vue'
import ChessBoard from '@/components/ChessBoard.vue';

const showModes = ref (false);
const showLocal = ref (false);

const showModesToggle = () => {
  showModes.value = !showModes.value;
  showLocal.value = false;
}
const showLocalToggle = () => {
  showLocal.value = !showLocal.value;
  if(showLocal.value){
    showModes.value = false;
  }
}

function StartLocalGame(color: string){
  console.log("Starting local game with color: " + color);

}

</script>

<template>
  <BasicButton @click="showModesToggle">JUGAR</BasicButton>

  <div v-if="showModes" class="bg-red-300 flex flex-col items-center justify-center">
    <BasicButton @click="showLocalToggle">Local</BasicButton>
    <BasicButton>Multijugador</BasicButton>
    <BasicButton>Maquina</BasicButton>
  </div>

  <div v-if="showLocal" class="flex flex-col items-center justify-center">
    <BasicButton>Blanco</BasicButton>
    <BasicButton>Negro</BasicButton>
  </div>

  <ChessBoard/>

</template>

<style scoped>
</style>
