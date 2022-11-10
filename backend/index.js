import express from "express";
import db from "./config/db.js";
import UserRoute from "./Routes/UserRoute.js";

// deklarasi express
const app = express();

// cek konseksi database
try {
  await db.authenticate();
  console.log("DB Connected!");
} catch (error) {
  console.log(error);
}

// generate new table db
// (async () => {
//   await db.sync();
// })();

// middleware
app.use(express.json());

// routing
app.use(UserRoute);

// cek server running
app.listen(5000, () => console.log("Server up and running!"));
