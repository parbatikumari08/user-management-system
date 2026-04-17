import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    console.log("Connecting with URI:", uri); // DEBUG

    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected:", conn.connection.host);
  } catch (error) {
    console.error("FULL ERROR:", error); 
    process.exit(1);
  }
};

export default connectDB;