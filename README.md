# File Transfer System Using Socket Programming

# Overview
# This project demonstrates a TCP socket-based file transfer system using Java for the server and Next.js (TypeScript) for the client frontend.
# The Java server handles multiple clients, receives files, and stores them in a local uploads folder.
# The Next.js client allows users to select and upload files (PDFs, images, etc.) to the server over a local network.
# This project shows how socket programming can enable file transfers between multiple devices in a centralized architecture.

# Features
# - Upload files from multiple clients to a single server.
# - Store uploaded files in a server-side uploads folder.
# - Handle multiple client connections simultaneously using multi-threading.
# - Frontend allows file selection and upload with a user-friendly interface.
# - Communication is done using TCP sockets for reliable file transfer.
# - Works across multiple PCs on the same local area network (LAN).

# Requirements

# Server (Java)
# - Java JDK 21 or higher.
# - Compatible with Windows, Linux, or WSL.
# - Sufficient file system permissions to create and write in the uploads folder.

# Client (Next.js)
# - Node.js >= 20.9.0
# - npm or yarn for package management.
# - Optional: TailwindCSS for styling.
# - TypeScript enabled.

# Setup Instructions

# 1️⃣ Server Setup
# - Navigate to the server directory:
# cd server
# - Compile all Java files:
# javac *.java
# - Start the server:
# java server.Server
# - Server will start and listen on port 6600:
# Server started on port 6600
# - Ensure the server PC is connected to the same local network as the clients.
# - The server will store received files in the uploads/ folder. If the folder doesn’t exist, it will be automatically created.

# 2️⃣ Client Setup (Next.js)
# - Navigate to the frontend directory:
# cd frontend
# - Install dependencies:
# npm install
# - Start the development server:
# npm run dev
# - Open the frontend in your browser:
# http://localhost:3000
# - Select a file and upload it. The file will be sent to the Java server over TCP sockets.
# - Update SERVER_IP in your frontend code to match the server’s LAN IP address.

# Network Considerations
# - Same LAN Required: All clients must be on the same network as the server.
# - Server IP Address: Check your server IP using:
# Windows: ipconfig
# Linux / WSL: hostname -I
# - Changing Networks: If the server switches networks, the IP changes. You must update SERVER_IP in the client.
# - Static IP Recommendation: To avoid frequent IP updates, assign a static IP or use DHCP reservation on your router.

# How It Works
# - Client Upload:
#   - Client selects a file in the frontend.
#   - The file is read as a buffer and sent over a TCP socket to the server.
#   - The client sends metadata: filename length, filename, and file size.
# - Server Receive:
#   - Server accepts the client socket.
#   - Reads metadata to determine the filename and file size.
#   - Reads the file bytes from the socket and saves them in the uploads folder.
#   - Sends a confirmation message back to the client.
# - Multiple Clients:
#   - Server spawns a new thread for each client connection.
#   - Allows multiple clients to upload files simultaneously without blocking.

# Project Structure
# file-transfer-networking-project/
# ├── server/
# │   ├── Server.java        # Main server file
# │   ├── ClientHandler.java # Handles each client connection and file saving
# │   ├── uploads/           # Folder where uploaded files are saved
# │   └── Client.java        # Optional: standalone Java client
# ├── frontend/
# │   ├── app/               # Next.js app folder
# │   │   ├── page.tsx       # Main page with file upload UI
# │   │   └── route.ts       # API route for sending file to server
# │   ├── public/            # Public assets
# │   ├── package.json       # Node dependencies
# │   └── tsconfig.json      # TypeScript config
# ├── .gitignore
# └── README.md

# Limitations
# - Files are stored locally on the server; there is no database integration.
# - IP-based connections require clients to be on the same LAN as the server.
# - Currently, the system does not handle authentication or secure file transfer (no encryption).

# Future Improvements
# - Integrate a database to store file metadata.
# - Add download functionality for clients.
# - Implement encryption for secure file transfer.
# - Add user authentication and access control.
# - Deploy the server on a static IP or public server for access across different networks.

# Real-World Applications
# - LAN-based file sharing between multiple devices.
# - Collaborative workspaces in offices.
# - Educational projects for understanding TCP socket programming.
# - Foundations for cloud storage services like Google Drive or Dropbox, using sockets instead of HTTP.

# Author
# Kavindu Sanjitha
# Student / Developer
# GitHub Repository Link – add your repo here
