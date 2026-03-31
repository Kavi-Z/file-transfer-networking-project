package server;

import java.io.*;
import java.net.Socket;

public class ClientHandler implements Runnable {

    private Socket socket;
    private String uploadDir;

    public ClientHandler(Socket socket, String uploadDir) {
        this.socket = socket;
        this.uploadDir = uploadDir;
    }

    @Override
    public void run() {
        try {
            DataInputStream dis = new DataInputStream(socket.getInputStream());
            DataOutputStream dos = new DataOutputStream(socket.getOutputStream());

            // Read command from client
            String command = dis.readUTF();

            if ("UPLOAD".equals(command)) {
                String fileName = dis.readUTF();   // Read file name
                long fileSize = dis.readLong();    // Read file size

                System.out.println("Receiving file: " + fileName);
                System.out.println("Expected size: " + fileSize + " bytes");

                File uploads = new File(uploadDir);
                uploads.mkdirs();

                FileOutputStream fos = new FileOutputStream(uploadDir + "/" + fileName);

                byte[] buffer = new byte[4096];
                long totalRead = 0;
                int bytesRead;

                while (totalRead < fileSize &&
                       (bytesRead = dis.read(buffer, 0,
                               (int)Math.min(buffer.length, fileSize - totalRead))) != -1) {
                    fos.write(buffer, 0, bytesRead);
                    totalRead += bytesRead;
                }

                fos.close();
                System.out.println("File saved successfully!");
                System.out.println("Actual received: " + totalRead + " bytes");

                dos.writeUTF("Upload successful!");
                dos.flush();

            } else if ("DOWNLOAD".equals(command)) {
                String fileName = dis.readUTF();
                File file = new File(uploadDir + "/" + fileName);

                if (!file.exists()) {
                    dos.writeLong(-1);
                    dos.writeUTF("File not found on server!");
                    dos.flush();
                } else {
                    dos.writeLong(file.length());

                    FileInputStream fis = new FileInputStream(file);
                    byte[] buffer = new byte[4096];
                    int bytesRead;
                    while ((bytesRead = fis.read(buffer)) != -1) {
                        dos.write(buffer, 0, bytesRead);
                    }
                    fis.close();
                    dos.flush();

                    dos.writeUTF("Download complete!");
                    dos.flush();
                }
            }

            socket.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}