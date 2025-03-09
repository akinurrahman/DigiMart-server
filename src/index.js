import app from "./app.js";
import { connectDb } from "./config/db.js";
import { envConfig } from "./config/env.config.js";

connectDb()
  .then(() => {
    app.listen(envConfig.port, () => {
      console.log(`server is running at port : ${envConfig.port}`);
    });
  })
  .catch((err) => {
    console.log(`Mongodb connection failed: `, err);
  });
