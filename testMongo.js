import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://ashwanigoutam16:RnLvmDDukL0xrt82@cluster0.vo7ok0b.mongodb.net/rkc?retryWrites=true&w=majority";

async function run() {
  const client = new MongoClient(uri, {
    tls: true,
    tlsAllowInvalidCertificates: true, // Windows local fix
    serverSelectionTimeoutMS: 5000,    // quick fail if unreachable
  });

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB!");

    await client.db("admin").command({ ping: 1 });
    console.log("✅ Ping successful!");
  } catch (err) {
    console.error("❌ Connection error:", err);
  } finally {
    await client.close();
  }
}

run();
