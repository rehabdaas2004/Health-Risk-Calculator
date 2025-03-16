require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Endpoint for Health Risk Calculation
app.post('/calculate-risk', (req, res) => {
    const { age, bmi, bloodPressure, familyHistory } = req.body;
    let riskScore = 0;

    // Age risk
    if (age < 30) riskScore += 0;
    else if (age < 45) riskScore += 10;
    else if (age < 60) riskScore += 20;
    else riskScore += 30;

    // BMI risk
    if (bmi < 25) riskScore += 0;
    else if (bmi < 30) riskScore += 30;
    else riskScore += 75;

    // Blood Pressure risk
    const bpRisks = { normal: 0, elevated: 15, stage1: 30, stage2: 75, crisis: 100 };
    riskScore += bpRisks[bloodPressure] || 0;

    // Family Disease risk
    if (familyHistory) {
        riskScore += familyHistory.length * 10;
    }

    // Determine risk category
    let category = "Low Risk";
    if (riskScore > 20) category = "Moderate Risk";
    if (riskScore > 50) category = "High Risk";
    if (riskScore > 75) category = "Uninsurable";

    res.json({ riskScore, category });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
