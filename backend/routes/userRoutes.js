const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  assignTask,
  deleteUser,
} = require("../controllers/userControllers");

const { auth } = require("../middlewares/auth");

router.get('/getallusers', auth, getAllUsers);
router.post('/assigntask/:userId', auth, assignTask);
router.delete('/deleteuser/:id', auth, deleteUser);

module.exports = router;