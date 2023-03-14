const { response } = require("express");
const { generateJWT } = require("../middlewares/jwt");
const {
  hashPassword,
  validatePassword,
} = require("../middlewares/validateFields");
const User = require("../models/user");

const createUser = async (req, res = response) => {
  try {
    const { name, email, password } = req.body;

    const emailExists = await User.findOne({ email });
    // console.log(emailExists);
    if (emailExists)
      return res.status(404).json({ ok: false, msg: "Invalid credentials" });

    const hashedPassword = hashPassword(password);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = await generateJWT(newUser.id);

    return res.status(201).json({
      ok: true,
      msg: "User created",
      token,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const loginUser = async (req, res = response) => {
  try {
    const { email, password } = req.body;
    const emailExists = await User.findOne({ email });
    // console.log(emailExists);
    if (!emailExists) {
      return res.status(400).json({ ok: false, msg: "Invalid credentials" });
    }
    const validPassword = validatePassword(password, emailExists.password);
    if (!validPassword) {
      return res.status(400).json({ ok: false, msg: "Invalid credentials" });
    }
    const token = await generateJWT(emailExists.id);
    return res.status(201).json({
      ok: true,
      msg: "User logged",
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const renewToken = async (req, res = response) => {
  const uid = req.uid;
  const token = await generateJWT(uid);
  const user = await User.findById(uid);
  console.log(user);

  res.status(200).json({
    ok: true,
    msg: "Go ahead",
    user,
    token,
  });
};

module.exports = {
  createUser,
  loginUser,
  renewToken,
};
