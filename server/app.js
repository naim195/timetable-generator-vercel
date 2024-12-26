const express = require("express");
const cors = require("cors");
const path = require("path");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const { JWT } = require("google-auth-library");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let sheetId = process.env.GOOGLE_SHEET_ID || "";

const cleanSlot = (slot) => {
  if (!slot) return [];
  return slot
    .split(/[\s,]+/)
    .map((s) => s.replace(/\n.*$/, "").trim()) // Remove text after newlines and trim
    .filter((s) => s.length > 0 && /^[A-Z]\d+$/.test(s)); // Filter valid slots like "D1", "D2"
};

const preprocessData = (data) => {
  return data.map((course) => ({
    "Course Number": course["Course Number"],
    "Course Name": course["Course Name"],
    Lecture: cleanSlot(course.Lecture),
    Tutorial: cleanSlot(course.Tutorial),
    Lab: cleanSlot(course.Lab),
  }));
};

app.post("/update-sheet-id", (req, res) => {
  const { id } = req.body;
  if (id) {
    sheetId = id;
    return res.status(200).json({ message: "Sheet ID updated successfully." });
  }
  return res.status(400).json({ error: "Sheet ID is required." });
});

app.get("/api", async (req, res) => {
  try {
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);

    await doc.loadInfo();
    const sheet = doc.sheetsByTitle["Time table"];
    const rows = await sheet.getRows();

    const timetableData = rows.map((row) => ({
      "Course Number": row.get("Course Number"),
      "Course Name": row.get("Course Name"),
      Lecture: row.get("Lecture"),
      Lab: row.get("Lab"),
      Tutorial: row.get("Tutorial"),
    }));

    const processedData = preprocessData(timetableData);
    console.log(preprocessData);
    res.json(processedData);
  } catch (error) {
    console.error("Error fetching timetable data:", error);
    res.status(500).json({ error: "Failed to fetch timetable data" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});
