import Users from "./../Models/UserModel.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll();

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
