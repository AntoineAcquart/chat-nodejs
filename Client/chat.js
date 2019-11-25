if (localStorage.getItem("name")) {
  login(localStorage.getItem("name"));
} else {
  document.getElementById("login").innerHTML = `
    <form>
        <span class="formText">Entrez votre nom :</span>
        <input type="text" id="name" />
        <input
          type="button"
          value="se connecter"
          onclick="login(document.getElementById('name').value)"
        />
    </form>
  `;
}

const socket = io();

socket.on("serverInit", data => {
  console.log(data);
  if (data.messages && data.users) {
    loadChat(data.messages, data.users);
  }
});

socket.on("serverMessage", data => {
  console.log(data);
  writeMessage(data);
});

socket.on("serverNewUser", data => {
  console.log("new user:", data);
  setColor(data.name, data.color);

  let node = document.createElement("div");
  node.classList.add("message", "information");
  node.innerHTML +=
    "<strong><span class='name user" +
    data.name +
    "'>" +
    data.name +
    "</span>" +
    " vient de se connecter ! </strong>";
  document.getElementById("chat").appendChild(node);
});

function loadChat(messages, users) {
  messages.forEach(message => {
    writeMessage(message);
  });
  users.forEach(user => {
    setColor(user.name, user.color);
  });
}

function writeMessage(message) {
  let node = document.createElement("div");
  node.classList.add("message");
  node.innerHTML +=
    "<span class='name user" +
    message.name +
    "'>" +
    message.name +
    "</span><div class='content'>" +
    message.content +
    "</div>";

  document.getElementById("chat").appendChild(node);
  document.getElementById("chat").scrollTop = document.getElementById(
    "chat"
  ).scrollHeight;
}

function send(message) {
  if (message.length > 0) {
    let name = localStorage.getItem("name");
    socket.emit("message", { name: name, message: message });
  }
}

function login(name) {
  localStorage.setItem("name", name);
  document.getElementById("login").remove();
  document.getElementById("sendBox").innerHTML = `
    <span class='name user${name}'>${name}</span>
     <form>
    <input type="text" id="message" minlength="1"/>
    <input
      type="button"
      value="envoyer"
      onclick="send(document.getElementById('message').value)"
    />
  </form>
  `;
}

function setColor(name, color) {
  document.getElementsByTagName("style")[0].innerHTML +=
    ".user" + name + " {color: " + color + ";}";
}
