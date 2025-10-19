import { config } from "dotenv";
import app from "./app";
import { testDbConnection } from "./utils/dbConnect";

config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await testDbConnection();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Server not started due to database connection failure.');
    process.exit(1); // Exit process with failure
  }
};

startServer();

