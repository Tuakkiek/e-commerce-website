// routes/promotionRoutes.js
import express from "express";
import { getActivePromotions, getAllPromotions, createPromotion, updatePromotion, deletePromotion } from "../controllers/promotionController.js";  // Sửa tên controller cho đúng
import { protect, restrictTo } from "../middleware/authMiddleware.js";  // Đảm bảo đường dẫn đúng

const router = express.Router();

router.get("/active", getActivePromotions);

router.use(protect);
router.use(restrictTo("ADMIN"));

router.get("/", getAllPromotions);
router.post("/", createPromotion);
router.put("/:id", updatePromotion);
router.delete("/:id", deletePromotion);

export default router;
