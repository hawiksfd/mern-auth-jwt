import Users from "./../Models/UserModel.js";
import bcrypt from "bcrypt";

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
  //   const { name, email, password, confPassword } = req.body;

  // cek password
  if (req.body.password !== req.body.confPassword)
    return res.status(400).json({ msg: "Password tidak sama!" });

  // hashing password
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  // create user
  try {
    await Users.create({
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
    });

    // response ke client
    res.json({ msg: "Regrister berhasil!" });
  } catch (error) {
    console.log(error);
  }
};
