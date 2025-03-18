const express = require("express");
const router = express.Router();
const { isUserValid } = require("../middleware/auth");
const { getList, clearList, addToList } = require("../controllers/list");

router.get("/", isUserValid, async (req, res) => {
  try {
    const list = await getList(req.user._id);
    return res.status(200).send(list.animes);
  } catch (e) {
    return res.status(400).send({ error: e.message });
  }
});

router.put("/:id", isUserValid, async (req, res) => {
  try {
  
    const updatedList = await addToList(req.params.id,req.user._id)

    return res.status(200).send(updatedList);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.delete("/", isUserValid, async (req, res) => {
  try {
    const list = await clearList(req.user._id);
    return res.status(200).send(list.animes);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

module.exports = router;
