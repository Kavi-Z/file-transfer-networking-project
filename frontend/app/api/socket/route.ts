import { NextRequest } from "next/server";
import net from "net";

const SERVER_IP = "192.168.1.5"; // Change this if your Java server runs on a different IP
const SERVER_PORT = 6600;

export const POST = async (req: NextRequest) => {
  try {
    const fileBuffer = Buffer.from(await req.arrayBuffer());
    const filename = req.headers.get("x-filename") || "uploaded_file";

    const result = await new Promise<{ success: boolean; message: string }>((resolve, reject) => {
      const client = new net.Socket();

      client.connect(SERVER_PORT, SERVER_IP, () => {
        console.log("Connected to Java server");

        // Create a DataOutputStream-like writer for Java compatibility
        const writeUTF = (str: string) => {
          const strBuffer = Buffer.from(str, 'utf8');
          const lengthBuffer = Buffer.alloc(2);
          lengthBuffer.writeUInt16BE(strBuffer.length, 0);
          client.write(lengthBuffer);
          client.write(strBuffer);
        };

        const writeLong = (num: number | bigint) => {
          const buffer = Buffer.alloc(8);
          buffer.writeBigInt64BE(BigInt(num), 0);
          client.write(buffer);
        };

        // Send operation type, filename, and file size (Java protocol)
        writeUTF("UPLOAD");
        writeUTF(filename);
        writeLong(fileBuffer.length);
      });

      let responseStep = 'permission';

      client.on("data", (data) => {
        const response = data.toString('utf8');
        console.log("Server response:", response);
        
        if (responseStep === 'permission') {
          if (response.includes("ALLOWED")) {
            console.log("Upload allowed, sending file...");
            client.write(fileBuffer);
            responseStep = 'final';
          } else {
            client.destroy();
            resolve({ success: false, message: "Upload denied by server" });
          }
        } else if (responseStep === 'final') {
          client.destroy();
          resolve({ success: true, message: response });
        }
      });

      client.on("error", (error) => {
        console.error("Socket error:", error);
        reject(error);
      });

      client.on("close", () => {
        console.log("Connection closed");
      });
    });

    return new Response(JSON.stringify(result), { 
      status: result.success ? 200 : 403 
    });

  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ 
      success: false, 
      message: "Connection error: " + err.message 
    }), { status: 500 });
  }
};
