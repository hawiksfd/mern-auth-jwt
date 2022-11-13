import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./config/db.js";
import UserRoute from "./Routes/UserRoute.js";

//deklarasi dot env
dotenv.config();

// deklarasi express
const app = express();

// cek konseksi database
// try {
//   await db.authenticate();
//   console.log("DB Connected!");
// } catch (error) {
//   console.log(error);
// }

// generate new table db
// (async () => {
//   await db.sync();
// })();

// middleware
app.use(
  cors({
    credentials: true, // client mengirim credentials
    origin: "http://localhost:3000", //
  })
); // cors untuk memberikan akses api diluar domain

app.use(cookieParser());
app.use(express.json());
app.use(UserRoute); // routing

// cek server running
app.listen(5000, () => console.log("Server up and running!"));
