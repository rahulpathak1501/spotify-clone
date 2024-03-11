// WebSocketService.js
const socket = new WebSocket("ws://localhost:3000");

socket.addEventListener("open", () => {
  console.log("WebSocket connection opened");
});

socket.addEventListener("message", (event) => {
  console.log("WebSocket message received:", event.data);

  const data = JSON.parse(event.data);
});

socket.addEventListener("close", (event) => {
  console.log("WebSocket connection closed:", event.code, event.reason);
});

export default socket;
