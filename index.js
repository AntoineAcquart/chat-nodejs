const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.use(express.static(path.join(__dirname, "Client")));

app.get("/", (req, res) => {
  console.log(req.url);
  res.send("===> GET <===");
});

app.post("/", (req, res) => {
  console.log(req.url);
  res.send("===> POST <===");
});

app.put("/", (req, res) => {
  console.log(req.url);
  res.send("===> PUT <===");
});

app.delete("/", (req, res) => {
  console.log(req.url);
  res.send("===> DELETE <===");
});

const http = require("http").createServer(app);
const io = require("socket.io")(http);

io.on("connection", client => {
  console.log("connexion");

  let messages;
  let users;

  messages = JSON.parse(fs.readFileSync("./messages.json"));
  users = JSON.parse(fs.readFileSync("./users.json"));

  client.emit("serverInit", { messages, users });

  client.on("message", data => {
    console.log("client data: ", data);
    let name = data.name;
    let message = data.message;
    let userExist;
    let color = "#";

    let file = JSON.parse(fs.readFileSync("./users.json"));

    for (let i in file) {
      let user = file[i];
      if (user.name === name) {
        userExist = true;
      }
    }

    if (userExist === undefined) {
      for (let i = 0; i < 6; i++) {
        let rdm = Math.floor(Math.random() * Math.floor(16));
        let hex = rdm.toString(16);
        color += hex;
      }

      content = { name: name, color: color };

      file.push(content);

      if (file != null) {
        fs.writeFile("./users.json", JSON.stringify(file), err => {
          if (err) {
            console.log("error: ", err);
          }
        });
      }

      io.emit("serverNewUser", content);
    }

    fs.readFile("./messages.json", (err, data) => {
      let messagesFile = JSON.parse(data);
      newMessage = { name: name, content: message };
      console.log("newMessage: ", newMessage);
      messagesFile.push(newMessage);

      fs.writeFile("./messages.json", JSON.stringify(messagesFile), err => {
        if (err) {
          console.log("error: ", err);
        }
      });
      io.emit("serverMessage", newMessage);
    });
  });
});

http.listen(3001);

// const http = require("http");
// const fs = require("fs");

// fs.readFile("./Client/index.html", "utf8", (err, data) => {
//   if (err) {
//     console.error(err);
//   }

//   if (data) {
//     const server = http.createServer((req, res) => {
//       res.end(data);
//     });

//     const io = require("socket.io")(server);
//     io.on("connection", client => {
//       console.log("connexion");

//       let messages;
//       let users;

//       messages = JSON.parse(fs.readFileSync("./messages.json"));
//       users = JSON.parse(fs.readFileSync("./users.json"));

//       client.emit("serverInit", { messages, users });

//       client.on("message", data => {
//         console.log("client data: ", data);
//         let name = data.name;
//         let message = data.message;
//         let userExist;
//         let color = "#";

//         let file = JSON.parse(fs.readFileSync("./users.json"));

//         for (let i in file) {
//           let user = file[i];
//           if (user.name === name) {
//             userExist = true;
//           }
//         }

//         if (userExist === undefined) {
//           for (let i = 0; i < 6; i++) {
//             let rdm = Math.floor(Math.random() * Math.floor(16));
//             let hex = rdm.toString(16);
//             color += hex;
//           }

//           content = { name: name, color: color };

//           file.push(content);

//           if (file != null) {
//             fs.writeFile("./users.json", JSON.stringify(file), err => {
//               if (err) {
//                 console.log("error: ", err);
//               }
//             });
//           }

//           io.emit("serverNewUser", content);
//         }

//         fs.readFile("./messages.json", (err, data) => {
//           let messagesFile = JSON.parse(data);
//           newMessage = { name: name, content: message };
//           console.log("newMessage: ", newMessage);
//           messagesFile.push(newMessage);

//           fs.writeFile("./messages.json", JSON.stringify(messagesFile), err => {
//             if (err) {
//               console.log("error: ", err);
//             }
//           });
//           io.emit("serverMessage", newMessage);
//         });
//       });
//     });

//     server.listen(3000);
//   }
// });
