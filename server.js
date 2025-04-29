const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const db = require("./database/db");

const app = express();
const port = 3000;

// CORS configuration
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    details: err.message,
  });
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use("/admin", express.static('admin'));

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/images/products'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "product-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// API Routes
app.get("/api/products", (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post("/api/products", upload.single("image"), (req, res) => {
  const { name, price, description, category, stock } = req.body;
  // Update the imagePath to include the full URL
  const imagePath = `/images/products/${req.file.filename}`;

  db.run(
    `INSERT INTO products (name, price, description, image_path, category, stock)
         VALUES (?, ?, ?, ?, ?, ?)`,
    [name, price, description, imagePath, category, stock],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        id: this.lastID,
        message: "Product added successfully",
        imagePath: imagePath, // Send back the image path for verification
      });
    }
  );
});

// Add delete product endpoint
app.delete("/api/products/:id", (req, res) => {
  const id = req.params.id;

  // First get the product to find its image path
  db.get("SELECT image_path FROM products WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!row) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    // Delete the product from database
    db.run("DELETE FROM products WHERE id = ?", id, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      // Delete the image file
      const imagePath = path.join(__dirname, 'public', row.image_path);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image file:", err);
        }
      });

      res.json({ message: "Product deleted successfully" });
    });
  });
});

app.get("/api/products/:id", (req, res) => {
  const id = req.params.id;
  
  db.get("SELECT * FROM products WHERE id = ?", [id], (err, row) => {
      if (err) {
          console.error('Database error:', err);
          res.status(500).json({ error: err.message });
          return;
      }
      
      if (!row) {
          res.status(404).json({ error: "Product not found" });
          return;
      }
      
      res.json(row);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});



