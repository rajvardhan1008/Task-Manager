const Task = require('../models/Task');
const User = require('../models/User');

exports.create = async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo } = req.body;
    const userId = req.body.userId;

    if(!title || !description || !dueDate || !priority){
        return res.status(400).json({
            success:false,
            message: 'All fields are required'
        });
    }

    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      createdBy: userId,
      assignedTo: assignedTo || null,
    });
    await task.save();

    res.status(201).json({ 
        success: true,
        message: 'Task created successfully',
        task, 
    });
  } catch (error) {
    console.error('Create task error:', error);  // <-- Log on server side
    res.status(500).json({ 
        success: false, 
        message: 'Server Error', 
        error: error.message || error  // <-- Send error message to client
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const userId = req.params.userId;
    const role = req.body;
    let tasks;
    if (role === 'admin') {
      tasks = await Task.find().populate('createdBy assignedTo', 'fullName email');
    } else {
      tasks = await Task.find({
        $or: [{ createdBy: userId }, { assignedTo: userId }]
      }).populate('createdBy assignedTo', 'fullName email');
    }
    console.log("task fetched for id", userId);

    res.status(200).json({ 
        success: true, 
        message: 'All tasks fetched successfully',
        tasks 
    });
  } catch (error) {
    res.status(500).json({ 
        success: false, 
        message: 'Server Error', 
        error 
    });
  }
};


exports.getById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
                     .populate('createdBy assignedTo', 'fullName email');

    if (!task) return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
    });

    // Get user info from either auth token or query params
    const userId = req.user?.id || req.query.userId;
    const role = req.user?.role || req.query.role;

    if (role !== 'admin' && 
        task.createdBy._id.toString() !== userId && 
        task.assignedTo?._id.toString() !== userId) {
      return res.status(403).json({ 
            success: false, 
            message: 'Unauthorized access'
        });
    }

    res.status(200).json({ 
        success: true, 
        message: 'Task fetched successfully',
        task 
    });
  } catch (error) {
    res.status(500).json({ 
        success: false, 
        message: 'Server Error', 
        error 
    });
  }
};


exports.update = async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
    });

    if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ 
            success: false, 
            message: 'Unauthorized access' 
        });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.priority = priority || task.priority;
    task.assignedTo = assignedTo || task.assignedTo;

    await task.save();
    res.status(200).json({ 
        success: true, 
        message: 'Task updated successfully',
        task 
    });
  } catch (error) {
    res.status(500).json({ 
        success: false, 
        message: 'Server Error', 
        error 
    });
  }
};


exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
    }

    // Check permissions
    const isAdmin = req.user?.role === 'admin';
    const isCreator = task.createdBy.toString() === userId;
    
    if (!isAdmin && !isCreator) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized access' 
      });
    }

    const user = await User.findOne({_id : userId});

    await Task.findByIdAndDelete(id);
    res.status(200).json({ 
      success: true, 
      message: 'Task deleted successfully', 
      user
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
};


exports.updateStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    const userId = req.body.userId;
    const role = req.body.role;
    console.log("task", task);
    console.log("userid", req.body.userId);
    console.log("role", req.body.role);
    console.log("stauts", req.body.status);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    if (role !== 'admin' && task.assignedTo?.toString() !== userId && task.createdBy.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    task.status = req.body.status || task.status;
    await task.save();
    res.status(200).json({ 
        success: true, 
        message: 'Task updated successfully',
        task 
    });
  } catch (error) {
    res.status(500).json({ 
        success: false, 
        message: 'Server Error', 
        error 
    });
  }
};


exports.changePriority = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
    });

    if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, 
            message: 'Unauthorized access' 
        });
    }

    task.priority = req.body.priority;
    await task.save();
    res.status(200).json({ 
        success: true, 
        message: 'Priority successfully changed',
        task 
    });
  } catch (error) {
    res.status(500).json({ 
        success: false, 
        message: 'Server Error', 
        error 
    });
  }
};