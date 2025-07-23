const express = require("express");
const app = express();
const stripe = require("stripe")("sk_test_..."); // Replace with real secret key
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Tap-to-Tip Backend Live!");
});

// ROUTE: Create Checkout Session
app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: "Tip",
          },
          unit_amount: 500, // $5 tip
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: "https://your-frontend.com/success",
      cancel_url: "https://your-frontend.com/cancel",
    });

    res.json({ url: session.url });
  } catch (e) {
    console.error("Error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
