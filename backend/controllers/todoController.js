const pool = require("../db");

exports.getTodos = async (req, res) => {
    const userId = req.user.id;
    const result = await pool.query("SELECT * FROM todos WHERE user_id = $1 ORDER BY id DESC", [userId]);
    res.json(result.rows);
  };
  
  exports.createTodo = async (req, res) => {
    const { text } = req.body;
    const userId = req.user.id;
    const result = await pool.query(
      "INSERT INTO todos (text, user_id) VALUES ($1, $2) RETURNING *",
      [text, userId]
    );
    res.status(201).json(result.rows[0]);
  };
  
  exports.updateTodo = async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user.id;
  
    await pool.query(
      "UPDATE todos SET text = $1 WHERE id = $2 AND user_id = $3",
      [text, id, userId]
    );
    res.json({ message: "Todo updated" });
  };
  
  exports.deleteTodo = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
  
    await pool.query("DELETE FROM todos WHERE id = $1 AND user_id = $2", [id, userId]);
    res.json({ message: "Todo deleted" });
  };