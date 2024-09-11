import mongoose from "mongoose";

const MONGO_URI = "mongodb://localhost:27017/ecommerce";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Conexión exitosa a la base de datos de MongoDB");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);

    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();

    console.log("Desconectado de la base de datos de MongoDB");
  } catch (error) {
    console.error("Error al desconectar de la base de datos:", error);
  }
};
