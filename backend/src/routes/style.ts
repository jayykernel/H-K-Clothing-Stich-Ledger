import { Router } from 'express';
import {
  createStyle,
  getStyles,
  getStyleById,
  updateStyle,
  deleteStyle,
} from '../controllers/style';

const router = Router();

router.post('/', createStyle);
router.get('/', getStyles);
router.get('/:id', getStyleById);
router.put('/:id', updateStyle);
router.delete('/:id', deleteStyle);

export default router;
