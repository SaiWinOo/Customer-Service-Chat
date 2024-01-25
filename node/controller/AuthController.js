
const User = require("../model/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { config } = require('../config/Config');


const register = async (req, res, next) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ message: 'fill all the fields' })
  }
  const duplicate = await User.findOne({ email }).exec();
  if (duplicate) {
    return res.status(409).json({ message: 'Email already exists' });
  }

  try {
    let data = { name, email };
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    data.password = hashPassword;
    let newUser = await User.create(data);
    let payload = { id: newUser._id };
    const token = jwt.sign(payload, config.TOKEN_SECRET);
    return res.json({ user: newUser, token })
  } catch (error) {
    console.log(error);
    return res.status(422).json({ message: 'fail to create user' });
  }
}


const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ message: 'fill all the fields' });
  }
  let user = await User.findOne({ email }).exec();
  if (!user) {
    return res.status(422).json({ message: 'The email is invalid' });
  }
  const validPass = await bcrypt.compare(password, user.password);
  if (validPass) {
    let payload = { id: user._id };
    const token = await jwt.sign(payload, config.TOKEN_SECRET);
    return res.json({ user, token });
  } else {
    return res.status(422).json({ message: 'Invalid email or password' });
  }

}


const getUser = async (req, res) => {
  let user = await User.findById(req.user.id);
  return res.json({ user });
}

module.exports = {
  register, login, getUser,
}