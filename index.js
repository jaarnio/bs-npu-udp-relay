// External dependencies
const axios = require("axios");
const qs = require("qs");
const dgram = require("dgram");

// Create UDP socket
const udpSocket = dgram.createSocket('udp4');
const udpListenerPort = 5002;
const udpSenderPort = 5000;

// Reusable function to make POST call to set User Variable values
// User Variables are specific to a BrightAuthor:connected Presentation
// This is part of the Local Web Server of the player
const postToSetValues = async (payload) => {
  try {
    const response = await axios.post(
      "http://localhost:8008/SetValues",
      qs.stringify(payload),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Referer: "http://localhost:8008", // Add Referer request header
        },
        maxRedirects: 10,
      }
    );
    //console.log("Response:", response.data);
  } catch (error) {
    console.error("Error:", error);
  }
};

// Function to send UDP message
const sendUdpMessage = (message, port = udpSenderPort, host = '127.0.0.1') => {
  const buffer = Buffer.from(message);
  
  udpSocket.send(buffer, 0, buffer.length, port, host, (err) => {
    if (err) {
      console.error("Error sending UDP message:", err);
      return;
    }
    console.log(`UDP message "${message}" sent to ${host}:${port}`);
  });
};

// Function to handle incoming UDP messages
const setupUdpListener = (port = udpListenerPort) => {
  udpSocket.on('message', async (msg, rinfo) => {
    console.log(`Received UDP message from ${rinfo.address}:${rinfo.port}`);
    
    try {
      // Parse JSON payload
      const data = JSON.parse(msg.toString());
      console.log("Parsed data:", data);
      
      // Expected keys to process
      const expectedKeys = ['faces_attending', 'faces_in_frame_total', 'timestamp'];
      
      // Process each expected key
      for (const key of expectedKeys) {
        if (data.hasOwnProperty(key)) {
          // Create payload for this key-value pair
          const payload = {
            [key]: data[key]
          };
          
          // Post to set values
          await postToSetValues(payload);
          console.log(`Posted ${key}: ${data[key]}`);
        }
      }
      
      // Send "update" UDP message after processing
      sendUdpMessage("update");
      
    } catch (error) {
      console.error("Error processing UDP message:", error);
    }
  });
  
  udpSocket.on('error', (err) => {
    console.error(`UDP server error: ${err}`);
  });
  
  udpSocket.on('listening', () => {
    const address = udpSocket.address();
    console.log(`UDP server listening on ${address.address}:${address.port}`);
  });
  
  // Start listening
  udpSocket.bind(port);
};

// Initialize UDP listener
setupUdpListener(5000);

