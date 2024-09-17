import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://BackendAvanzado:Vc6y0PEkm2DtLKWC@backendavanzado.lqbjg.mongodb.net/?retryWrites=true&w=majority&appName=BackendAvanzado",
      { dbName: "BackendAvanzado" }
    );
    console.log("Conexión exitosa a la base de datos de MongoDB");
  } catch (error) {
    console.error("Error al conectar a DB:", error);
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
