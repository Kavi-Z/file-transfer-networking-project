package server;

import java.net.ServerSocket;
import java.net.Socket;
import java.util.Scanner;

public class Server {

    private static final int PORT = 6600;
    private static final String UPLOAD_DIR = "uploads";
    private static Scanner serverScanner = new Scanner(System.in);

    public static void main(String[] args) {
        try {
            ServerSocket serverSocket = new ServerSocket(PORT);
            System.out.println("=== File Transfer Server ===");
            System.out.println("Server started on port " + PORT);
            System.out.println("Waiting for clients...");
            System.out.println("You can allow/deny file uploads as they come.");
            System.out.println("==============================");

            while (true) {
                Socket clientSocket = serverSocket.accept();
                new Thread(new ClientHandler(clientSocket, UPLOAD_DIR, serverScanner)).start();
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

