const User = require('../model/User');

const getUsers = async (req, res) => {

  let users = await User.find(
    { _id: { $ne: req.user.id } }
  ).exec();

  return res.json({ users })
}

const getUser = async (req, res) => {
  const { id } = req.params;
  let user = await User.findById(id).exec();
  return res.json({ user });
}

module.exports = { getUsers, getUser };