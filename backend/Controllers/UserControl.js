import Users from "./../Models/UserModel.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ["id", "name", "email"],
    });

    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

export const Register = async (req, res) => {
  // constract request body
  const { name, email, password, confPassword } = req.body;

  // cek akun by email
  const cekEmail = await Users.findAll({
    where: { email: email },
  });

  if (email === cekEmail[0].email)
    return res.status(404).json({ msg: "Akun sudah terdaftar!" });

  // cek password
  if (password !== confPassword)
    return res.status(400).json({ msg: "Password tidak sama!" });

  // hashing password
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  // create user
  try {
    await Users.create({
      name: name,
      email: email,
      password: hashPassword,
    });

    // response ke client
    res.json({ msg: "Regrister berhasil!" });
  } catch (error) {
    console.log(error);
  }
};

export const Login = async (req, res) => {
  try {
    // cek akun by email
    const user = await Users.findAll({
      where: { email: req.body.email },
    });

    // cek password
    const match = await bcrypt.compare(req.body.password, user[0].password);

    if (!match) return res.status(400).json({ msg: "Password anda salah!" });

    // constract field user
    const userId = user[0].id;
    const name = user[0].name;
    const email = user[0].email;

    // membuat access token
    const accessToken = jsonwebtoken.sign(
      { userId, name, email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "20s",
      }
    );

    // membuat refresh token
    const refreshToken = jsonwebtoken.sign(
      { userId, name, email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // update refresh token db
    await Users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );

    // setting refresh token pada cookie
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    // kirim response ke client access token
    res.json({ accessToken });
  } catch (error) {
    res.status(404).json({ msg: "Akun anda tidak ditemukan!" });
  }
};
