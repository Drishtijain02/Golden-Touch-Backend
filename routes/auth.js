const router = require("express").Router();

const supabase = require("../config/supabase");          // Service Role client
const supabaseAuth = require("../config/supabaseAuth");  // Auth client



// =========================
// LOGIN
// =========================
// =========================
// LOGIN
// =========================
router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                error: "Email and password are required."
            });

        }

        // Authenticate using Supabase Auth
        const { data, error } = await supabaseAuth.auth.signInWithPassword({

            email,
            password

        });

        if (error) {

            return res.status(401).json({
                error: error.message
            });

        }

        // Fetch profile from admin_users
        const { data: profile, error: profileError } = await supabase
            .from("admin_users")
            .select("id, full_name, email, role")
            .eq("id", data.user.id)
            .single();

        if (profileError) {

            return res.status(404).json({
                error: "Admin profile not found."
            });

        }

        res.json({

            message: "Login successful",

            session: data.session,

            user: {

                id: profile.id,
                full_name: profile.full_name,
                role: profile.role

            }

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Server error"
        });

    }

});

module.exports = router;
