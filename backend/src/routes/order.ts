import { Router } from 'express';
import {
  createOrder,
  createOrderFromCosting,
  getOrders,
  getOrderById,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/order';

const router = Router();

router.post('/', createOrder);
router.post('/from-costing', createOrderFromCosting);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id', updateOrder);
router.patch('/:id/status', updateOrderStatus);
router.delete('/:id', deleteOrder); // Soft delete (archive)

export default router;
