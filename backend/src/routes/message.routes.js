// Module: Mounts the rate-limited public contact endpoint and admin message operations.
const express = require("express");
const messageController = require("../controllers/message.controller");
const { authorizeRoles, isAuthenticatedUser } = require("../middlewares/auth");
const messageRateLimiter = require("../middlewares/messageRateLimiter");
const validateRequest = require("../middlewares/validateRequest");
const {
    createMessageSchema,
    messagesQuerySchema,
    updateMessageSchema,
} = require("../schemas/message.schema");

const router = express.Router();
const authorizeAdmin = authorizeRoles("admin");

router.post(
    "/",
    messageRateLimiter,
    validateRequest(createMessageSchema),
    messageController.createMessage,
);

router.use(isAuthenticatedUser, authorizeAdmin);

router.get(
    "/",
    validateRequest(messagesQuerySchema, "query"),
    messageController.getMessages,
);
router.get("/:id", messageController.getMessage);
router.patch(
    "/:id",
    validateRequest(updateMessageSchema),
    messageController.updateMessage,
);
router.delete("/:id", messageController.deleteMessage);

module.exports = router;