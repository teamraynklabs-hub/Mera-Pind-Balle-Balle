import mongoose from "mongoose";

async function testMongoDB() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.log("❌ MONGODB_URI is not set in environment variables");
    console.log("Available env keys:", Object.keys(process.env).filter(k => k.includes("MONGO") || k.includes("DB")));
    return;
  }

  console.log("Testing MongoDB connection...");
  console.log("Connection string:", mongoUri.replace(/:[^:]*@/, ":***@"));

  try {
    const connection = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ MongoDB connection successful!");
    console.log("Connected to:", connection.connection.name);
    await mongoose.connection.close();
  } catch (error: any) {
    console.error("❌ MongoDB connection failed:");
    console.error("Error:", error.message);
    console.error("Code:", error.code);
    
    // Specific error diagnostics
    if (error.code === "ECONNREFUSED") {
      console.log("\n💡 Connection refused - Check:");
      console.log("   1. MongoDB Atlas cluster is running");
      console.log("   2. Your IP is whitelisted in Network Access");
      console.log("   3. Credentials in connection string are correct");
    }
    
    if (error.message.includes("querySrv")) {
      console.log("\n💡 DNS/SRV issue - Check:");
      console.log("   1. Connection string format is correct");
      console.log("   2. Network allows DNS queries to MongoDB Atlas");
      console.log("   3. Try using direct connection string instead of SRV");
    }
  }
}

testMongoDB();
