const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
console.log('auth:', auth);
const { getTodos, createTodo, updateTodo, deleteTodo } = require("../controllers/todoController");

router.use(auth);
router.get("/", getTodos);
router.post("/", createTodo);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

module.exports = router;