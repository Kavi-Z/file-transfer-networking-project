package client;

import java.io.*;
import java.net.Socket;
import java.util.Scanner;

public class Client {

    public static void main(String[] args) throws Exception {
        Socket socket = new Socket("localhost", 6600);
        DataOutputStream out = new DataOutputStream(socket.getOutputStream());
        DataInputStream in = new DataInputStream(socket.getInputStream());
        Scanner scanner = new Scanner(System.in);

        while (true) {
            System.out.println("Choose option: 1. Upload 2. Download 3. Exit");
            int choice = scanner.nextInt();
            scanner.nextLine(); // consume newline

            if (choice == 1) {
                System.out.print("Enter file path to upload: ");
                String path = scanner.nextLine();
                File file = new File(path);
                if (!file.exists()) {
                    System.out.println("File not found!");
                    continue;
                }

                out.writeUTF("UPLOAD");
                out.writeUTF(file.getName());
                out.writeLong(file.length());
                
                // Wait for server permission
                String permission = in.readUTF();
                if ("ALLOWED".equals(permission)) {
                    System.out.println("Server allowed the upload. Sending file...");
                    
                    FileInputStream fis = new FileInputStream(file);
                    byte[] buffer = new byte[4096];
                    int bytes;
                    while ((bytes = fis.read(buffer)) != -1) {
                        out.write(buffer, 0, bytes);
                    }
                    fis.close();
                    
                    String result = in.readUTF();
                    System.out.println("Server response: " + result);
                } else {
                    String result = in.readUTF();
                    System.out.println("Upload denied: " + result);
                }

            } else if (choice == 2) {
                System.out.print("Enter file name to download: ");
                String fileName = scanner.nextLine();
                out.writeUTF("DOWNLOAD");
                out.writeUTF(fileName);

                long size = in.readLong();
                if (size == -1) {
                    System.out.println(in.readUTF());
                    continue;
                }

                File file = new File("downloads/" + fileName);
                file.getParentFile().mkdirs();
                FileOutputStream fos = new FileOutputStream(file);

                byte[] buffer = new byte[4096];
                long read = 0;
                while (read < size) {
                    int bytesRead = in.read(buffer, 0, (int)Math.min(buffer.length, size - read));
                    read += bytesRead;
                    fos.write(buffer, 0, bytesRead);
                }
                fos.close();
                System.out.println("File downloaded to downloads/" + fileName);
                System.out.println("Server: " + in.readUTF());

            } else if (choice == 3) {
                socket.close();
                System.exit(0);
            } else {
                System.out.println("Invalid choice!");
            }
        }
    }
}

