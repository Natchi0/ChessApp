<script setup lang="ts">
import BoardSquare from "@/components/BoardSquare.vue";
import { BoardLogic } from "@/logic/Board";
import { useSquaresStore } from "@/stores/squares";
import { storeToRefs } from "pinia";

const store = useSquaresStore()
const Board = BoardLogic.GetInstance();
const {squares} = storeToRefs(store)

</script>

<template>

  <div class="chessboard-container bg-yellow-950">
    <div class="chessboard">
      <!-- fila con guias -->
      <div class="guide"></div>
      <div v-for="letter in ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']" :key="letter" class="guide">{{ letter }}</div>
      <div class="guide"></div>

      <!-- construir el tablero  -->
      <template v-for="(square, index) in squares" :key="index">

        <div v-if="index%8 == 0" class="guide">{{ index / 8 + 1 }}</div>

        <BoardSquare :color="(Math.floor(index / 8)) % 2 == 0 ? index % 2 === 0 : index % 2 !== 0" :piece="square"/>

        <div v-if="index%8 == 7" class="guide">{{ (index - 7) / 8 + 1 }}</div>

      </template>

      <!-- fila con guias -->
      <div class="guide"></div>
      <div v-for="letter in ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']" :key="letter" class="guide">{{ letter }}</div>
      <div class="guide"></div>

    </div>
  </div>

</template>

<style scoped>

.chessboard-container {
  width: 100%;
  max-width: 40rem;
  margin: 0 auto;
}

.chessboard {
  display: grid;
  aspect-ratio: 1 / 1;
  width: 100%;
  grid-template-columns: 0.25fr repeat(8, 1fr) 0.25fr; /* Columnas: guía - tablero - guía */
  grid-template-rows: 0.25fr repeat(8, 1fr) 0.25fr; /* Filas: guía - tablero - guía */
}

.guide {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  color: white;
  font-size: 0.75rem;
}

</style>
