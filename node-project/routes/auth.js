const { register, login, getUser } = require('../controller/AuthController');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// router.use((req, res, next) => {
//   console.log('Time:', Date.now())
//   next()
// })

router.post('/register', register)
router.post('/login', login)
router.use(auth.verifyUserToken);
router.get('/me', getUser);

module.exports = router;