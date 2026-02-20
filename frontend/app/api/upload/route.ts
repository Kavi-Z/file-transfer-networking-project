import { NextRequest } from "next/server";
import net from "net";

export const runtime = "nodejs";

const SERVER_IP = "localhost";
const SERVER_PORT = 6600;

export const POST = async (req: NextRequest) => {
  try {
    const fileBuffer = Buffer.from(await req.arrayBuffer());
    const filename = req.headers.get("x-filename") || "uploaded_file";

    await new Promise<void>((resolve, reject) => {
      const client = new net.Socket();

      client.connect(SERVER_PORT, SERVER_IP, () => {
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

      client.on("data", () => {
        client.destroy();
        resolve();
      });

      client.on("error", reject);
    });

    return Response.json({ success: true });

  } catch (err) {
    console.error(err);
    return Response.json({ success: false }, { status: 500 });
  }
};
