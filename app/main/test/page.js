'use client';

// import React, { useState, useEffect } from 'react';
// import { io } from 'socket.io-client';

// const Index = () => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     // Initialize socket connection
//     const newSocket = io('http://localhost:3002'); // Replace with your server URL
//     setSocket(newSocket);

//     // Listen for incoming messages
//     newSocket.on('chat message', (message) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });

//     // Cleanup on component unmount
//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   const sendMessage = () => {
//     if (socket && newMessage.trim() !== '') {
//       socket.emit('chat message', newMessage);
//       setNewMessage('');
//     }
//   };

//   return (
//     <div className="pt-20 bg-slate-200">
//       <h1>Real-Time Chat</h1>
//       <div className="messages">
//         {messages.map((message, index) => (
//           <div key={index}>{message}</div>
//         ))}
//       </div>
//       <div>
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Type your message..."
//           className="border p-2 rounded"
//         />
//         <button onClick={sendMessage} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Index;

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const NotificationComponent = () => {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:3001'); // Connect to the Socket.IO server

    // Listen for notification
    socket.on('notification', (data) => {
      setNotification(data);
    });

    return () => {
      socket.disconnect(); // Cleanup on component unmount
    };
  }, []);

  return (
    <div className='pt-20 '>
      <h1>Notification</h1>
      <p>{notification || 'No notifications yet.'}</p>
    </div>
  );
};

export default NotificationComponent;

