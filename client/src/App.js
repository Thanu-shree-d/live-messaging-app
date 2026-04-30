import { io } from "socket.io-client";
import React, { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [typing, setTyping] = useState(false);
  const socket = io.connect("https://live-messaging-app-5c5q.onrender.com");

  const chatEndRef = useRef(null);

  const sendMessage = () => {
    if (!message.trim()) return;

    setChat([
      ...chat,
      {
        text: message,
        sender: "me",
        time: new Date().toLocaleTimeString(),
      },
    ]);

    setMessage("");
    setTyping(false);
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    setTyping(e.target.value.length > 0);
  };

  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <div className="container">
      <div className="chat">

        <div className="header">
          <h3>Chat Room</h3>
          <span className="status">Online</span>
        </div>

        <div className="messages">
          {chat.map((msg, i) => (
            <div key={i} className={`bubble ${msg.sender}`}>
              <p>{msg.text}</p>
              <span>{msg.time}</span>
            </div>
          ))}

          {typing && <div className="typing">Typing...</div>}

          <div ref={chatEndRef}></div>
        </div>

        <div className="inputBox">
          <button onClick={() => setShowEmoji(!showEmoji)}>😊</button>

          <input
            value={message}
            onChange={handleTyping}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button onClick={sendMessage}>➤</button>
        </div>

        {showEmoji && (
          <div className="emoji">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}

      </div>
    </div>
  );
}

export default App;