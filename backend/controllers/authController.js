const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");


const isValidEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

exports.register = async (req, res) => {
    const {email, password } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    try {
        const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if(userCheck.rows.length > 0) {
          return res.status(400).json({message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password,10);
        
        const result = await pool.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
            [email, hashedPassword]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
      console.log("Error during registration:", err); 
        res.status(500).json({ message: "User already exists or DB error" });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      console.log("User check result:", userCheck.rows);
      if (user.rows.length === 0)
        return res.status(400).json({ message: "Invalid credentials" });
  
      const valid = await bcrypt.compare(password, user.rows[0].password);
      if (!valid) return res.status(400).json({ message: "Invalid credentials" });
  
      const token = jwt.sign({ id: user.rows[0].id, email: user.rows[0].email }, process.env.JWT_SECRET);
      res.json({ token });
    } catch (err) {
      res.status(500).json({ message: "Login error" });
    }
  };