console.log("Offers route loaded");
const router = require("express").Router();
const supabase = require("../config/supabase");

// GET all offers
router.get("/", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("offers")
            .select("*")
            .order("start_date", { ascending: false });

        if (error) throw error;

        res.json(data);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Failed to fetch offers"
        });
    }
});

// POST new offer
router.post("/", async (req, res) => {
    try {
        const {
            title,
            description,
            image_url,
            start_date,
            end_date,
            active
        } = req.body;

        const { data, error } = await supabase
            .from("offers")
            .insert([{
                title,
                description,
                image_url,
                start_date,
                end_date,
                active
            }])
            .select();

        if (error) throw error;

        res.status(201).json(data[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Failed to create offer"
        });
    }
});

// UPDATE offer
router.put("/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const {
            title,
            description,
            image_url,
            start_date,
            end_date,
            active
        } = req.body;

        const { data, error } = await supabase
            .from("offers")
            .update({
                title,
                description,
                image_url,
                start_date,
                end_date,
                active
            })
            .eq("id", id)
            .select();

        if (error) throw error;

        res.json(data[0]);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Failed to update offer"
        });

    }

});

// DELETE offer
router.delete("/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const { error } = await supabase
            .from("offers")
            .delete()
            .eq("id", id);

        if (error) throw error;

        res.json({
            message: "Offer deleted successfully"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Failed to delete offer"
        });

    }

});

module.exports = router;