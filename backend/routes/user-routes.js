import UserModel from "../models/user-model.js";
import { body, param } from "express-validator";
import express from "express";
import { userController } from "../controllers/user-controller.js";

export const router = express.Router();

// Route to get all users
router.get("/", userController.getAllUsers);

// Route to get a user by ID
router.get("/:id", userController.getUserById);

// Route to create a new user
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("age").isNumeric().withMessage("Age must be a number"),
    body("mobile").notEmpty().withMessage("Mobile is required"),
    body("email").isEmail().withMessage("Email is required"),
  ],
  userController.createUser
);

// Route to update a user by ID
router.put(
  "/:id",
  [
    param("id").isMongoId().withMessage("Invalid user ID"),
    body("name").optional().notEmpty().withMessage("Name is required"),
    body("age").optional().isNumeric().withMessage("Age must be a number"),
    body("mobile").optional().notEmpty().withMessage("Mobile is required"),
    body("email").optional().isEmail().withMessage("Email is required"),
  ],
  userController.updateUser
);

router.delete("/:id", userController.deleteUser);
