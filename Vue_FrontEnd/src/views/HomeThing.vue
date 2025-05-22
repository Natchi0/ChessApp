<script setup lang="ts">
import { ref } from 'vue';
import BasicButton from '@/components/BasicButton.vue'
import ChessBoard from '@/components/ChessBoard.vue';
import { useSquaresStore } from '@/stores/squares'
import { socketService } from "@/services/socketService";

const showModes = ref (false);
const showLocal = ref (false);

const store = useSquaresStore()

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

const crearPartida = () => {
  fetch("http://localhost:5093/createGame", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      Id1: 1,
      Id2: 2,
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then(data => {
    console.log("Game created successfully:", data);
    const gameId = data.value.id
    store.setGameId(gameId);
  })
  .catch(error => {
    console.error("Error creating game:", error);
  });
}

function joinPartida() {
  const msg =
  {
    "Type": "join",
    "GameId": store.getGameId(),
    "PlayerId": 1
  }
  socketService.sendMessage(JSON.stringify(msg));

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

  <BasicButton @click="crearPartida">Iniciar Partida</BasicButton>

  <BasicButton @click="joinPartida">Join</BasicButton>

  <ChessBoard/>

</template>

<style scoped>
</style>
