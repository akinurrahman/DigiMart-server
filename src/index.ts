import { envConfig } from "./config/env.config.js";
import { connectDb } from "./config/db.js";
import app from "./app.js";

connectDb()
  .then(() => {
    app.listen(envConfig.port, () => {
      console.log(`server is running at port : ${envConfig.port}`);
    });
  })
  .catch((err: unknown) => {
    console.log(`Mongodb connection failed: `, err);
  });
