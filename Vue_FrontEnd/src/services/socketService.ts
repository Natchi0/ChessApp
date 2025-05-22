import { useSquaresStore } from '@/stores/squares'
import { GameState } from '@/logic/GameState';

const socket = new WebSocket('ws://localhost:5093');
socket.onopen = () => {
  console.log('WebSocket connection established');
};
socket.onclose = () => {
  console.log('WebSocket connection closed');
}
socket.onerror = (error) => {
  console.error('WebSocket error:', error);
};

socket.onmessage = (event) => {
  const message = event.data;

  // Solo intenta parsear si parece JSON
  if (typeof message === 'string' && (message.trim().startsWith('{') || message.trim().startsWith('['))) {
    try {
      const data = JSON.parse(message);
      if (data.BoardState) {
        console.log('BoardState:', data.BoardState);
        const squaresStore = useSquaresStore();
        squaresStore.setSquares(data.BoardState);

        const gameState = GameState.GetInstance();
        gameState.actualizarEstado(data);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  } else {
    // Mensaje no JSON, puedes manejarlo aquí si lo necesitas
    console.log('Mensaje no JSON recibido:', message);
  }
}

const sendMessage = (message: string) => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(message);
    console.log('Sent message:', message);
  } else {
    console.error('WebSocket is not open. Unable to send message.');
  }
};

export const socketService = {
  sendMessage
};
