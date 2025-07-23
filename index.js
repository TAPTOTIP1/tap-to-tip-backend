const express = require("express");
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
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

//ROUTE: Stripe Test Connection
app.get("/test-stripe", async (req, res) => {
  try {
    const balance = await stripe.balance.retrieve();
    res.json({ status: "success", balance });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// DO NOT MOVE THIS — it must be last
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
