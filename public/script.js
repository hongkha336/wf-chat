
const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

// Icons made by Freepik from www.flaticon.com
// const BOT_IMG = "https://image.flaticon.com/icons/svg/327/327779.svg";
const PERSON_IMG = "https://image.flaticon.com/icons/svg/145/145867.svg";
const BOT_IMG = "https://image.flaticon.com/icons/svg/145/145867.svg";
const BOT_NAME = "PER2";
const PERSON_NAME = "PER1";

const socket = io('http://localhost:3000')
const messageContainer = document.getElementById('message-container')
const roomContainer = document.getElementById('room-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const room = document.getElementById('room-name')
if (msgerForm != null) {
  const name = prompt('What is your name?');
  appendMessage(`You`, PERSON_IMG, "right", `connected`);
  socket.emit('new-user', roomName, name);
  room.innerHTML = "[ROOM " + roomName +" ]";

  msgerForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value;
    appendMessage(name, PERSON_IMG, "right", message);
    socket.emit('send-chat-message', roomName, message);
    messageInput.value = '';
  })
}

socket.on('room-created', room => {
  roomLink.href = `/${room}`;
})

socket.on('chat-message', data => {
  appendMessage(`${data.name}`, BOT_IMG, "left", `${data.message}`);
})

socket.on('user-connected', name => {
  appendMessage(`${name}`, BOT_IMG, "left", `connected`);
})

socket.on('user-disconnected', name => {
  appendMessage(`${name}`, BOT_IMG, "left", `disconnected`);
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}

function appendMessage(name, img, side, text) {
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}

// Utils
function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
