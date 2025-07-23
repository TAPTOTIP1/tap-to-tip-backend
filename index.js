const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();

app.use(cors());
app.use(express.json());

// ROUTE: Root
app.get("/", (req, res) => {
  res.send("Tap-to-Tip Backend Live!");
});

// ROUTE: Create Checkout Session
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate the amount (must be number and >= 50 cents)
    if (!amount || typeof amount !== "number" || amount < 50) {
      return res.status(400).json({ error: "Invalid amount. Must be at least $0.50." });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Tip",
            },
            unit_amount: amount, // dynamic tip from frontend
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://tap-to-tip-frontend-33uk.vercel.app/success",
      cancel_url: "https://tap-to-tip-frontend-33uk.vercel.app/cancel",
    });

    res.json({ url: session.url });
  } catch (e) {
    console.error("Error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// ROUTE: Stripe Test Connection
app.get("/test-stripe", async (req, res) => {
  try {
    const balance = await stripe.balance.retrieve();
    res.json({ status: "success", balance });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
