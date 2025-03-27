router.post('/', async (req, res) => {
  console.log("Ontvangen body:", req.body);

  try {
    const { email, answers, average } = req.body;
    if (!answers || average === undefined) {
      return res.status(400).json({ error: 'answers of average ontbreekt' });
    }

    const newResult = new Result({ email, answers, average });
    await newResult.save();

    console.log("✅ Succesvol opgeslagen in MongoDB");
    res.status(201).json({ message: 'Result opgeslagen' });
  } catch (err) {
    console.error("❌ Fout bij opslaan:", err);
    res.status(500).json({ message: "Error saving result", error: err });
  }
});
