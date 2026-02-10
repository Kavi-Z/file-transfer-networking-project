package server;

import java.io.*;
import java.net.Socket;

public class ClientHandler implements Runnable {

    private Socket socket;

    public ClientHandler(Socket socket) {
        this.socket = socket;
    }

    public void run() {
        try {
            DataInputStream in = new DataInputStream(socket.getInputStream());
            DataOutputStream out = new DataOutputStream(socket.getOutputStream());

            while (true) {
                String command = in.readUTF();

                if (command.equalsIgnoreCase("UPLOAD")) {
                    String fileName = in.readUTF();
                    long fileSize = in.readLong();

                    File file = new File("uploads/" + fileName);
                    file.getParentFile().mkdirs();

                    FileOutputStream fos = new FileOutputStream(file);
                    byte[] buffer = new byte[4096];
                    long read = 0;

                    while (read < fileSize) {
                        int bytes = in.read(buffer, 0, (int)Math.min(buffer.length, fileSize - read));
                        read += bytes;
                        fos.write(buffer, 0, bytes);
                    }

                    fos.close();
                    out.writeUTF("OK");
                    System.out.println("File received: " + fileName);

                } else if (command.equalsIgnoreCase("DOWNLOAD")) {
                    String fileName = in.readUTF();
                    File file = new File("uploads/" + fileName);

                    if (!file.exists()) {
                        out.writeLong(-1);
                        out.writeUTF("ERROR: File not found");
                        continue;
                    }

                    out.writeLong(file.length());
                    FileInputStream fis = new FileInputStream(file);
                    byte[] buffer = new byte[4096];
                    int bytes;
                    while ((bytes = fis.read(buffer)) != -1) {
                        out.write(buffer, 0, bytes);
                    }
                    fis.close();
                    out.flush();
                    out.writeUTF("OK");
                    System.out.println("File sent: " + fileName);

                } else {
                    out.writeUTF("ERROR: Unknown command");
                }
            }

        } catch (IOException e) {
            System.out.println("Client disconnected.");
        } finally {
            try {
                socket.close();
            } catch (IOException e) {}
        }
    }
}

