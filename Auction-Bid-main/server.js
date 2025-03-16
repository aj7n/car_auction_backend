const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();
const Item = require("./models/Item"); // Import Item model

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Connect to MongoDB
connectDB();

// WebSocket Setup
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", credentials: true },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("placeBid", async ({ itemId, newBid, userId }) => {
    try {
      const item = await Item.findById(itemId);
      if (!item) {
        socket.emit("bidError", { error: "Item not found" });
        return;
      }

      if (newBid <= item.bidprice) {
        socket.emit("bidError", { error: "Bid must be higher than the current highest bid" });
        return;
      }

      item.bidprice = newBid;
      item.userwhobuyed = userId;
      await item.save();

      socket.broadcast.emit("bidUpdate", { itemId, newBid }); // Notify all except sender
    } catch (error) {
      console.error("Error updating bid:", error);
      socket.emit("bidError", { error: "Internal server error" });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Routes
app.use("/users", require("./routes/userRoutes"));
app.use("/items", require("./routes/itemRoutes"));

// REST API for updating bid
app.put("/items/bid/:id", async (req, res) => {
  try {
    const { bidprice, userId } = req.body;
    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ error: "Item not found" });

    if (bidprice <= item.bidprice) {
      return res.status(400).json({ error: "Bid must be higher than the current highest bid" });
    }

    item.bidprice = bidprice;
    item.userwhobuyed = userId;
    await item.save();

    io.emit("bidUpdate", { itemId: item._id, newBid: bidprice });

    res.json({ message: "Bid updated successfully", item });
  } catch (error) {
    console.error("Error updating bid:", error);
    res.status(500).json({ error: "Error updating bid" });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
