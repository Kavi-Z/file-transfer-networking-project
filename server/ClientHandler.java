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

            int nameLength = dis.readInt();

            byte[] nameBytes = new byte[nameLength];
            dis.readFully(nameBytes);
            String fileName = new String(nameBytes);

            long fileSize = dis.readLong();

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

            DataOutputStream dos = new DataOutputStream(socket.getOutputStream());
            dos.writeUTF("OK");
            dos.flush();

            socket.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

