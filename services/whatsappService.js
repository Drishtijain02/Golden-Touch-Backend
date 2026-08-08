const axios = require("axios");

const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const API_VERSION = process.env.WHATSAPP_API_VERSION || "v23.0";

const WHATSAPP_URL =
    `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`;

async function sendWhatsAppMessage(to, message) {
    try {
        const response = await axios.post(
            WHATSAPP_URL,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "text",
                text: {
                    body: message
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("WhatsApp message sent:", response.data);

        return response.data;

    } catch (error) {
        console.error(
            "WhatsApp error:",
            error.response?.data || error.message
        );

        throw error;
    }
}

module.exports = {
    sendWhatsAppMessage
};