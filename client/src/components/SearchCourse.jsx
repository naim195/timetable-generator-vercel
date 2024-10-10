import { useEffect, useState } from "react";
import { TextField, Autocomplete } from "@mui/material";
import PropTypes from "prop-types";

// Function to remove redundant courses and process the timetable
const removeRedundant = (timetableWithRedundant) => {
  const seenCourseCodes = new Set();
  return timetableWithRedundant.filter((course) => {
    if (
      !course ||
      !(
        Object.hasOwn(course, "Course Code") &&
        Object.hasOwn(course, "Course Name")
      ) ||
      course["Course Code"].includes("XX")
    ) {
      return false;
    }
    if (seenCourseCodes.has(course["Course Code"])) {
      return false;
    } else {
      seenCourseCodes.add(course["Course Code"]);
    }
    for (let prop in course) {
      if (prop === "Lecture" || prop === "Tutorial" || prop === "Lab") {
        if (typeof course[prop] === "string") {
          course[prop] = course[prop]
            .split(",")
            .map((slot) => slot.replace(/\n.*$/, "").trim());
        } else if (Array.isArray(course[prop])) {
          course[prop] = course[prop].map((slot) =>
            slot.replace(/\n.*$/, "").trim(),
          );
        } else {
          course[prop] = [];
        }
      }
    }
    return true;
  });
};

export default function SearchCourse({ addToSelected, selectedCourses }) {
  const [courseNameOrID, setCourseNameOrID] = useState("");
  const [timetable, setTimetable] = useState([]);

  // Fetch the timetable data from the server when the component mounts
  useEffect(() => {
    const getTimetableData = async () => {
      try {
        const response = await fetch(
          "https://timetable-generator-api.vercel.app/api",
        );

        const data = await response.json();

        const cleanedData = removeRedundant(data);
        setTimetable(cleanedData);
      } catch (error) {
        console.error("Error fetching timetable data:", error);
      }
    };

    getTimetableData();
  }, []);

  // Handle course filtering based on input
  const filteredCourses = timetable.filter(
    (course) =>
      courseNameOrID.trim() === "" ||
      course["Course Code"]
        .toUpperCase()
        .includes(courseNameOrID.toUpperCase()) ||
      course["Course Name"]
        .toUpperCase()
        .includes(courseNameOrID.toUpperCase()),
  );

  const availableOptions = filteredCourses.filter(
    (course) =>
      !selectedCourses.some(
        (selectedCourse) =>
          selectedCourse["Course Code"] === course["Course Code"],
      ),
  );

  return (
    <div>
      <Autocomplete
        freeSolo
        options={availableOptions}
        getOptionLabel={(option) =>
          `${option["Course Code"]} - ${option["Course Name"]}`
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Enter Course ID or Name"
            variant="filled"
          />
        )}
        onChange={(event, newValue) => {
          if (newValue) {
            addToSelected(newValue);
            setCourseNameOrID(""); // Clear the input after selection
          }
        }}
        disableCloseOnSelect
      />
    </div>
  );
}

SearchCourse.propTypes = {
  addToSelected: PropTypes.func.isRequired,
  selectedCourses: PropTypes.arrayOf(PropTypes.object).isRequired,
};
