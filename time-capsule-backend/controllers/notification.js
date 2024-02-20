const NotificationSchema = require("../models/NotificationModel");
const UserSchema = require("../models/UserModel");

exports.createNotification = async (req, res) => {
    const { receiverId, message } = req.body;
    const { senderId } = req.params;

    try {
        if (!receiverId || !message || !senderId) {
            return res.status(400).json({ message: 'All Fields Required' });
        }
        // Save the new moment to the database
        const notification = NotificationSchema({
            sender: senderId,
            receiver: receiverId,
            message
        })

        await notification.save()
        const receiver = await UserSchema.findOne({ _id: receiverId });
        if (!receiver) {
            return res.status(404).json({ message: 'Receiver not found' });
        }

        // Update the user's moments array with the new moment
        receiver.notifications.push(notification._id);
        await receiver.save();

        res.status(200).json({ message: 'Notification created and sent to receiver' });
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getNotification = async (req, res) => {
    const { notificationId } = req.params;

    try {
        if (!notificationId) {
            return res.status(400).json({ message: 'id is required' });
        }

        const notification = await NotificationSchema.findOne({ _id: notificationId });

        if (!notification) {
            return res.status(404).json({ message: 'notification not found' });
        }

        res.status(200).json(notification);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteNotification = async (req, res) => {
    const { notificationId } = req.params;
    const { userId } = req.body;

    try {
        const user = await UserSchema.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove the notificationId from user.notifications
        user.notifications.pull(notificationId);
        await user.save();

        // Delete the notification
        await NotificationSchema.findByIdAndDelete(notificationId);

        res.status(200).json({ message: 'Notification deleted' });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
