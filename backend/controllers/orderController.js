// backend/controllers/orderController.js
import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice
  } = req.body;

  if (!orderItems || !orderItems.length) {
    res.status(400);
    throw new Error('No order items');
  }

  const order = new Order({
    orderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Get order by id
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  // ensure owner or admin — optional here
  if (order.user._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }
  res.json(order);
});
// new code


//import Order from '../models/orderModel.js';

export const deleteOrder = async (req, res) => {
  try{
    const order = await Order.findById(req.params.id);
    if(!order) return res.status(404).json({ message: 'Order not found' });

    // only order owner or admin can delete
    if(order.user.toString() !== req.user._id.toString() && !req.user.isAdmin){
      return res.status(401).json({ message: 'Not authorized' });
    }

    await order.deleteOne();
    res.json({ message: 'Order removed' });
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}
