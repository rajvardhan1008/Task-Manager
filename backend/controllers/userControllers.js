const User = require('../models/User');
const Task = require('../models/Task');

// admin only
exports.getAllUsers = async (req, res) => {
  try {
    // Get role from query parameters instead of body for GET request
    const { role } = req.query;
    
    if (role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized access' 
      });
    }

    const users = await User.find().select('-password');
    res.status(200).json({ 
      success: true, 
      message: 'All users fetched successfully',
      users 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
};

//admin only
exports.assignTask = async (req, res) => {
  try {
    const { taskId, role } = req.body;
    const { userId } = req.params; // The user to assign to

    // Verify the requesting user is admin
    if (role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized access' 
      });
    }

    // Verify the target user exists
    const userToAssign = await User.findById(userId);
    if (!userToAssign) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const task = await Task.findByIdAndUpdate(
      taskId,
      { assignedTo: userId },
      { new: true }
    ).populate('assignedTo createdBy', 'fullName email');

    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Task assigned successfully',
      task 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
};

// admin only
exports.deleteUser = async (req, res) => {
  try {
    // Get role from request body (for DELETE requests with body)
    const { role } = req.body;
    
    // Or get from headers if you prefer that approach
    // const role = req.headers['x-admin-role'];
    
    if (role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized access' 
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Remove user from any assigned tasks
    await Task.updateMany(
      { assignedTo: req.params.id }, 
      { $unset: { assignedTo: "" } }
    );

    res.status(200).json({ 
      success: true, 
      message: 'User deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
};
