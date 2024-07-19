# Timetable Generator

This is a timetable generator for the courses offered at IITGN during the 1st Semester, 2024-25.

---

## Description

This project is a Timetable Generator web application built using React. It allows users to search for courses by their IDs, select them, and generate a timetable based on the selected courses. The generated timetable can be copied to the clipboard .

---

## Features

1. **Search Course:**

   - Users can search for courses by entering their IDs.
   - The application provides real-time search results based on the input.

2. **Select Courses:**

   - Selected courses are displayed in a list.
   - Users can easily remove courses from the selection.

3. **Generate Timetable:**

   - Once courses are selected, users can generate a timetable.
   - The timetable displays course schedules for each day of the week.

4. **Copy to Clipboard:**

   - Generated timetables can be copied to the clipboard with a single click.
   - This facilitates easy modification of timetables in Google Sheets/Excel.

5. **Take screenshot:**
   - Users can easily take a screenshot of the generated timetable.

## Unsupported Features

- **Labs**: Lab/Tutorial slots for courses in which students are divided into multiple sections will not show up in the generated timetable. Only the lecture slots for such courses will be displayed on the generated timetable.

- **Dynamic Data**: The application uses static JSON data and does not fetch real-time updates from Google Sheets. I do plan to add this in the future. However, anyone willing to add this functionality can create a pull request.

## Technologies Used

- React
- Material-UI
- [Trie-Search](https://www.npmjs.com/package/trie-search) (for efficient searching)
- JSON (for storing course and timetable data)
- html2canvas (for capturing screenshots of the timetable)

## File Structure

- **Components:**
  - `SearchCourse.jsx`: Handles course search functionality.
  - `DisplayCourses.jsx`: Displays search results and handles course selection.
  - `Selected.jsx`: Manages selected courses and provides options to generate the timetable.
  - `Timetable.jsx`: Generates and displays the timetable.
- **Data:**
  - `timetable_data.json`: Contains course data.
  - `timetable_slots.json`: Contains timetable slots for each day of the week.

## Contributing

Contributions are welcome. Please fork the repository and submit a pull request with your changes.
