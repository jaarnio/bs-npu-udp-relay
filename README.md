# BrightSign NPU UDP Relay

A Node.js application designed to relay UDP messages from a BrightSign player's Neural Processing Unit (NPU) to BrightAuthor:connected Presentations via User Variables.

## Overview

This application acts as a bridge between the NPU running gaze-detection models on a BrightSign player and a BrightAuthor:connected Presentation. It listens for incoming UDP messages on port 5002, parses the JSON payload, and updates corresponding User Variables in the presentation.

## How It Works

1. The application creates a UDP socket that listens on port 5002 (configurable)
2. The BrightSign NPU sends JSON messages containing gaze-detection data to this port
3. The application parses the incoming JSON object to extract keys and values
4. For each key-value pair, it makes a POST request to the BrightSign Local Web Server to update User Variables
5. After processing, it sends an "update" UDP message to port 5000 (configurable)

## Requirements

- BrightSign player with NPU capabilities
- BrightAuthor:connected Presentation with User Variables that match expected keys
- Node.js runtime environment

## Expected JSON Format

The application expects JSON messages with the following keys:
- `faces_attending`
- `faces_in_frame_total`
- `timestamp`

Example:
```json
{
  "faces_attending": 2,
  "faces_in_frame_total": 3,
  "timestamp": 1714101234
}
```

## Setup Instructions

### In BrightAuthor:connected

1. Create User Variables with names matching the expected keys:
   - `faces_attending`
   - `faces_in_frame_total`
   - `timestamp`

2. Add this application as a Support File in your BrightAuthor:connected Presentation

### Configuration

The application uses the following default ports:
- UDP Listener Port: 5002 (for receiving messages from NPU)
- UDP Sender Port: 5000 (for sending "update" notifications)

These values can be modified in the code if needed.

## Building the Application

```bash
npm install
npm run build
```

## License

ISC