const router = require("express").Router();

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

router.get("/", (req, res) => {
    res.json({
        status: "WhatsApp route is working"
    });
});

router.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("WhatsApp webhook verified");
        return res.status(200).send(challenge);
    }

    return res.sendStatus(403);
});

router.post("/webhook", async (req, res) => {
    try {
        console.log(
            "WhatsApp webhook received:",
            JSON.stringify(req.body, null, 2)
        );

        res.sendStatus(200);
    } catch (error) {
        console.error("Webhook error:", error);
        res.sendStatus(500);
    }
});

module.exports = router;