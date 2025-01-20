import express from "express";

const app = express();
const PORT = 6000;

app.use(express.json());

app.post("/iras/", (req, res) => {
  const mockData = {
    employeeName: "John Doe",
    taxYear: "2024",
    taxableIncome: 50000,
    taxAmount: 5000,
  };

  return res.status(200).json(mockData);
});

app.listen(PORT, () => {
  console.log(`Mock IRAS server running on http://localhost:${PORT}`);
});
