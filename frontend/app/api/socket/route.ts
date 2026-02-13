import { NextRequest } from "next/server";
import net from "net";

const SERVER_IP = "172.17.168.90";
const SERVER_PORT = 6600;

export const POST = async (req: NextRequest) => {
  try {
    const fileBuffer = Buffer.from(await req.arrayBuffer());
    const filename = req.headers.get("x-filename") || "uploaded_file";

    await new Promise<void>((resolve, reject) => {
      const client = new net.Socket();

      client.connect(SERVER_PORT, SERVER_IP, () => {
        console.log("Connected to Java server");

        const nameBuffer = Buffer.from(filename);

        const header = Buffer.alloc(4);
        header.writeInt32BE(nameBuffer.length, 0);

        const sizeBuffer = Buffer.alloc(8);
        sizeBuffer.writeBigInt64BE(BigInt(fileBuffer.length), 0);

        
        client.write(header);
        client.write(nameBuffer);
        client.write(sizeBuffer);
        client.write(fileBuffer);
      });

      client.on("data", (data) => {
        console.log("Server response:", data.toString());
        client.destroy();
        resolve();
      });

      client.on("error", reject);
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
};
