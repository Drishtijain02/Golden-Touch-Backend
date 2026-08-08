const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendOwnerBookingEmail(appointment) {
    const { data, error } = await resend.emails.send({
        from: "Golden Touch <onboarding@resend.dev>",
        to: [process.env.OWNER_EMAIL],
        subject: "New Appointment Booking - Golden Touch",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; background: #111; color: #f8f5ef;">
                
                <h2 style="color: #d4af37;">
                    New Appointment Booking
                </h2>

                <p>A new appointment has been booked through the Golden Touch website.</p>

                <div style="background: #1b1b1b; padding: 20px; margin-top: 20px;">
                    <p><strong>Booking ID:</strong> ${appointment.booking_id}</p>
                    <p><strong>Customer:</strong> ${appointment.customer_name}</p>
                    <p><strong>Phone:</strong> ${appointment.phone}</p>
                    <p><strong>Email:</strong> ${appointment.email || "Not provided"}</p>
                    <p><strong>Service:</strong> ${appointment.service}</p>
                    <p><strong>Date:</strong> ${appointment.preferred_date}</p>
                    <p><strong>Time:</strong> ${appointment.preferred_time}</p>
                    <p><strong>Message:</strong> ${appointment.message || "None"}</p>
                </div>

                <p style="margin-top: 25px;">
                    Please open the owner dashboard to confirm or manage this appointment.
                </p>
                <p style="margin-top: 25px;">
    Please open the owner dashboard to confirm or manage this appointment.
</p>

<a href="https://golden-touch-frontend.vercel.app/dashboard.html"
   style="
       display:inline-block;
       margin-top:15px;
       padding:12px 24px;
       background:#d4af37;
       color:#111;
       text-decoration:none;
       border-radius:6px;
       font-weight:bold;
       font-size:14px;
   ">
    Open Owner Dashboard
</a>

                <p style="color: #999;">
                    Golden Touch Family Salon
                </p>

            </div>
        `
    });

    if (error) {
        console.error("Email sending error:", error);
        throw error;
    }

    return data;
}

module.exports = {
    sendOwnerBookingEmail
};