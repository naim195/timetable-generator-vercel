const express = require("express");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const {JWT} = require("jsonwebtoken");
const app = express();
const port = 3000;

app.get("/api/timetable", async (req, res) => {
  try {
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Replace escaped newlines
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet(
      process.env.GOOGLE_SHEET_ID,
      serviceAccountAuth
    );

    await doc.loadInfo();
    const sheet = doc.sheetsByTitle["Time table"];
    const rows = await sheet.getRows();

    const timetableData = rows.map(row => ({
      courseCode: row["Course Code"],
      courseName: row["Course Name"],
      lecture: row["Lecture"],
      tutorial: row["Tutorial"],
      lab: row["Lab"]
    }));

    res.json(timetableData);
  } catch (error) {
    console.error("Error fetching timetable data:", error);
    res.status(500).json({ error: "Failed to fetch timetable data" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
