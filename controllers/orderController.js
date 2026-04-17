import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Create New Order
export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingInfo,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    const order = await Order.create({
      orderItems,
      shippingInfo,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      user: req.user.id,
      paidAt: Date.now()
    });

    // Update product stock
    for (const item of orderItems) {
      await updateStock(item.product, item.quantity);
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Product Stock
async function updateStock(productId, quantity) {
  const product = await Product.findById(productId);
  if (!product) return;
  product.stock = Math.max(0, product.stock - quantity);
  await product.save({ validateBeforeSave: false });
}

// Get Single Order
export const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Logged in User Orders
export const myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Orders - Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });

    let totalAmount = 0;
    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });

    res.status(200).json({ success: true, totalAmount, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Order Status - Admin
export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.orderStatus === 'Delivered') {
      return res.status(400).json({ success: false, message: 'Order already delivered' });
    }

    order.orderStatus = req.body.status;

    if (req.body.status === 'Delivered') {
      order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, message: 'Order status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Order - Admin
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    await order.deleteOne();

    res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
