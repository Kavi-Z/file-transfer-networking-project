package server;

import java.io.*;
import java.net.Socket;
import java.util.Scanner;

public class ClientHandler implements Runnable {

    private Socket socket;
    private String uploadDir;
    private Scanner serverScanner;

    public ClientHandler(Socket socket, String uploadDir, Scanner serverScanner) {
        this.socket = socket;
        this.uploadDir = uploadDir;
        this.serverScanner = serverScanner;
    }

    @Override
    public void run() {
        try {
            DataInputStream dis = new DataInputStream(socket.getInputStream());
            DataOutputStream dos = new DataOutputStream(socket.getOutputStream());
            
            // Read client's operation request first
            String operation = dis.readUTF();
            
            if ("UPLOAD".equals(operation)) {
                handleUpload(dis, dos);
            } else if ("DOWNLOAD".equals(operation)) {
                handleDownload(dis, dos);
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    private void handleUpload(DataInputStream dis, DataOutputStream dos) {
        try {
            String fileName = dis.readUTF();
            long fileSize = dis.readLong();

            System.out.println();
            System.out.println("[INFO] A file is uploading!");
            System.out.println("   File name: " + fileName);
            System.out.println("   File size: " + fileSize + " bytes");
            System.out.print("   Allow upload? (y/n): ");
            
            String response = serverScanner.nextLine().trim().toLowerCase();
            
            if (response.equals("y") || response.equals("yes")) {
                dos.writeUTF("ALLOWED");
                dos.flush();
                
                System.out.println("   [SUCCESS] Upload ALLOWED. Receiving file...");

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

                System.out.println("   [SUCCESS] File saved successfully!");
                System.out.println("   [INFO] Actual received: " + totalRead + " bytes");

                dos.writeUTF("File uploaded successfully!");
            } else {
                dos.writeUTF("DENIED");
                dos.flush();
                System.out.println("   [DENIED] Upload DENIED by server.");
                dos.writeUTF("Upload denied by server");
            }
            
            dos.flush();
            socket.close();
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    private void handleDownload(DataInputStream dis, DataOutputStream dos) {
        try {
            String fileName = dis.readUTF();
            File file = new File(uploadDir + "/" + fileName);
            
            if (!file.exists()) {
                dos.writeLong(-1);
                dos.writeUTF("File not found on server");
                dos.flush();
                return;
            }
            
            dos.writeLong(file.length());
            
            FileInputStream fis = new FileInputStream(file);
            byte[] buffer = new byte[4096];
            int bytes;
            while ((bytes = fis.read(buffer)) != -1) {
                dos.write(buffer, 0, bytes);
            }
            fis.close();
            
            dos.writeUTF("Download completed");
            dos.flush();
            socket.close();
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

