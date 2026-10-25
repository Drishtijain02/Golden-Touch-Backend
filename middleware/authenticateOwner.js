const supabase = require("../config/supabase");
const supabaseAuth = require("../config/supabaseAuth");

async function authenticateOwner(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                error: "Authentication required"
            });
        }

        const token = authHeader.slice(7);

        const { data, error } =
            await supabaseAuth.auth.getUser(token);

        if (error || !data.user) {
            return res.status(401).json({
                error: "Invalid or expired session"
            });
        }

        const { data: profile, error: profileError } =
            await supabase
                .from("admin_users")
                .select("id, role")
                .eq("id", data.user.id)
                .maybeSingle();

        if (profileError || !profile) {
            return res.status(403).json({
                error: "Owner access not authorized"
            });
        }

        if (profile.role !== "owner") {
            return res.status(403).json({
                error: "Insufficient permissions"
            });
        }

        req.user = data.user;
        req.ownerProfile = profile;

        next();
    } catch (err) {
        console.error("Owner authentication failed:", err);

        return res.status(500).json({
            error: "Unable to verify authentication"
        });
    }
}

module.exports = authenticateOwner;
