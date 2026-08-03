const router = require("express").Router();
const supabase = require("../config/supabase");

// GET all services
router.get("/", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("services")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;

        res.json(data);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Failed to fetch services"
        });
    }
});

// ADD service
router.post("/", async (req, res) => {
    try {

        const {
            name,
            category,
            price,
            duration,
            description,
            image_url,
            active
        } = req.body;

        const { data, error } = await supabase
            .from("services")
            .insert([{
                name,
                category,
                price,
                duration,
                description,
                image_url,
                active,
                created_at: new Date()
            }])
            .select();

        if (error) throw error;

        res.status(201).json(data[0]);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Failed to add service"
        });

    }
});

// UPDATE service
router.put("/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const {
            name,
            category,
            price,
            duration,
            description,
            image_url,
            active
        } = req.body;

        const { data, error } = await supabase
            .from("services")
            .update({
                name,
                category,
                price,
                duration,
                description,
                image_url,
                active
            })
            .eq("id", id)
            .select();

        if (error) throw error;

        res.json(data[0]);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Failed to update service"
        });

    }

});

// DELETE service
router.delete("/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const { error } = await supabase
            .from("services")
            .delete()
            .eq("id", id);

        if (error) throw error;

        res.json({
            message: "Service deleted successfully"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Failed to delete service"
        });

    }

});

module.exports = router;