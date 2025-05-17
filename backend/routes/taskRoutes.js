const express = require('express');
const router = express.Router();

const {
  create,
  getAll,
  getById,
  update,
  deleteTask,
  updateStatus,
  changePriority,
} = require('../controllers/taskController');

const { auth, isUser } = require('../middlewares/auth');

router.post('/create', auth, create);                 
router.get('/all/:userId', auth, getAll);                     
router.get('/:id', auth, getById);                    
router.put('/update/:id', auth, update);              
router.delete('/delete/:id', auth, deleteTask);           
router.patch('/update-status/:id', auth, updateStatus);      
router.patch('/priority/:id', auth, changePriority);  

module.exports = router;