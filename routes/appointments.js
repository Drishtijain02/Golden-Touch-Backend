const { validateAppointment } = require("../middleware/validation");
const { sendOwnerBookingEmail } = require("../services/emailService");

const router = require("express").Router();
const supabase = require("../config/supabase");
// ---------- GET all (newest first, with optional filters) ----------
// GET all appointments
router.get("/", async (req, res) => {
  try {
    let query = supabase
      .from("appointments")
      .select("*")
      .order("created_at", { ascending: false });

    if (req.query.status) {
      query = query.eq("status", req.query.status);
    }

    if (req.query.date) {
      query = query.eq("preferred_date", req.query.date);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({
        error: error.message,
      });
    }

    const appointments = data.map((appt) => ({
      id: appt.booking_id,
      name: appt.customer_name,
      phone: appt.phone,
      email: appt.email,
      service: appt.service,
      date: appt.preferred_date,
      time: appt.preferred_time,
      msg: appt.message,
      status: appt.status,
      created: appt.created_at,
      dbId: appt.id,
    }));

    res.json(appointments);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch appointments",
    });
  }
});

// ---------- POST new appointment ----------
// Create Appointment
router.post("/", validateAppointment, async (req, res) => {

  try {

    const {
    id,
    name,
    phone,
    email,
    service,
    date,
    time,
    msg
} = req.body;

    if (!name || !phone || !service) {
      return res.status(400).json({
        error: "Name, Phone and Service are required."
      });
    }

    const { data, error } = await supabase
      .from("appointments")
      .insert([
        {
          booking_id: id,
          customer_name: name,
          phone: phone,
          email: email,
          service: service,
          preferred_date: date,
          preferred_time: time,
          message: msg,
          status: "Pending"
        }
      ])
      .select()
      .single();

    if (error) {
    console.error(error);

    return res.status(500).json({
        error: error.message
    });
}

try {
    await sendOwnerBookingEmail(data);
} catch (emailError) {
    console.error("Failed to send owner email:", emailError);
}

res.status(201).json({
    id: data.booking_id,
    message: "Appointment booked successfully."
});

  }

  catch (err) {

    console.error(err);

    res.status(500).json({

      error: "Internal Server Error"

    });

  }

});
// ---------- PUT update appointment ----------
// ---------- PUT update appointment ----------
router.put("/:id", async (req, res) => {
  try {

    const { status } = req.body;

    const allowed = [
      "Pending",
      "Confirmed",
      "Completed",
      "Cancelled"
    ];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        error: "Invalid status"
      });
    }

    const { data, error } = await supabase
      .from("appointments")
      .update({
        status
      })
      .eq("booking_id", req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        error: error.message
      });
    }

    if (!data) {
      return res.status(404).json({
        error: "Appointment not found"
      });
    }

    res.json({
      message: "Status updated successfully",
      appointment: data
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Internal Server Error"
    });

  }
});

// ---------- DELETE ----------
// ---------- DELETE ----------
router.delete("/:id", async (req, res) => {

  try {

    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("booking_id", req.params.id);

    if (error) {
      return res.status(500).json({
        error: error.message
      });
    }

    res.json({
      message: "Appointment deleted successfully"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Internal Server Error"
    });

  }

});

module.exports = router;