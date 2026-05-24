const { Notification } = require('../models');

exports.getMyNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ recipientId: req.user._id })
      .sort({ isRead: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({ notifications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    
    if (notificationId) {
      await Notification.findOneAndUpdate(
        { _id: notificationId, recipientId: req.user._id },
        { isRead: true }
      );
    } else {
      await Notification.updateMany(
        { recipientId: req.user._id, isRead: false },
        { isRead: true }
      );
    }

    res.status(200).json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
