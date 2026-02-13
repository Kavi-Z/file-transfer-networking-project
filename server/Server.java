package server;

import java.net.ServerSocket;
import java.net.Socket;

public class Server {

    private static final int PORT = 6600;
    private static final String UPLOAD_DIR = "uploads";

    public static void main(String[] args) {
        try {
            ServerSocket serverSocket = new ServerSocket(PORT);
            System.out.println("Server started on port " + PORT);

            while (true) {
                Socket clientSocket = serverSocket.accept();
                new Thread(new ClientHandler(clientSocket, UPLOAD_DIR)).start();
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

