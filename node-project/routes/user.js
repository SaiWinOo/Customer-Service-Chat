const { getUsers, getUser } = require("../controller/UserController");

const router = require('express').Router();


router.get('/', getUsers);
router.get('/:id', getUser);

module.exports = router;
