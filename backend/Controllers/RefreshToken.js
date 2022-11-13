import Users from "./../Models/UserModel.js";
import jsonwebtoken from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  try {
    // ambil value token dari cookie
    const refreshToken = req.cookies.refresh_token;
    // validasi token
    if (!refreshToken) return res.sendStatus(401); // 401 = unauthorization
    // compare token dg token db
    const user = await Users.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    // jika token tidak cocok
    if (!user[0]) return res.sendStatus(403); // 403 = forbidden
    // jika token cocok
    jsonwebtoken.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        // jika eror
        if (err) res.sendStatus(403);

        // ambil data user
        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;

        // buat token baru
        const accessToken = jsonwebtoken.sign(
          { userId, name, email },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "15s",
          }
        );
        // kirim response ke user
        res.json({ accessToken });
      }
    );
  } catch (error) {
    console.log(error);
  }
};
