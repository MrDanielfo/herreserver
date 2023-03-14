const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const validateFields = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errors.mapped(),
    });
  }

  next();
};

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync();
  const newPassword = bcrypt.hashSync(password, salt);
  return newPassword;
};

const validatePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

module.exports = {
  validateFields,
  hashPassword,
  validatePassword,
};
