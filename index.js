const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Tap-to-Tip Backend Live!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
