import Newsletter from '../models/Newsletter.js';

// Subscribe to newsletter
export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Check if email already exists
    const existingSubscriber = await Newsletter.findOne({ email: email.toLowerCase() });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return res.status(200).json({ 
          success: true, 
          message: 'You are already subscribed to our newsletter!' 
        });
      } else {
        // Reactivate subscription
        existingSubscriber.isActive = true;
        existingSubscriber.subscribedAt = Date.now();
        await existingSubscriber.save();
        return res.status(200).json({ 
          success: true, 
          message: 'Successfully resubscribed to our newsletter!' 
        });
      }
    }

    // Create new subscription
    const subscriber = await Newsletter.create({
      email: email.toLowerCase(),
      subscribedAt: Date.now(),
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to our newsletter!',
      subscriber: {
        email: subscriber.email,
        subscribedAt: subscriber.subscribedAt
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(200).json({ 
        success: true, 
        message: 'You are already subscribed to our newsletter!' 
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Unsubscribe from newsletter
export const unsubscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const subscriber = await Newsletter.findOne({ email: email.toLowerCase() });

    if (!subscriber) {
      return res.status(404).json({ success: false, message: 'Email not found in our newsletter list' });
    }

    subscriber.isActive = false;
    await subscriber.save();

    res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all active subscribers (Admin only)
export const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find({ isActive: true }).sort({ subscribedAt: -1 });

    res.status(200).json({
      success: true,
      count: subscribers.length,
      subscriptions: subscribers // using "subscriptions" key to match frontend
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a subscription (Admin only)
export const deleteSubscription = async (req, res) => {
  try {
    const subscription = await Newsletter.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }
    await subscription.deleteOne();
    res.status(200).json({ success: true, message: 'Subscription deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};