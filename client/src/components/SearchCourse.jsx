import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import TrieSearch from "trie-search";
import DisplayCourses from "./DisplayCourse";
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
      if (typeof course[prop] === "string" && course[prop].includes("\n")) {
        course[prop] = course[prop].split("\n")[0];
      }
      if (prop === "Lecture" || prop === "Tutorial" || prop === "Lab") {
        course[prop] = course[prop].split("\n")[0].split(",");
      }
    }
    return true;
  });
};

export default function SearchCourse({ addToSelected, selectedCourses }) {
  const [courseNameOrID, setCourseNameOrID] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [timetable, setTimetable] = useState([]);

  // Fetch the timetable data from the server when the component mounts
  useEffect(() => {
    const getTimetableData = async () => {
      try {
        const response = await fetch("https://timetable-generator-api.vercel.app/api/timetable");
        const data = await response.json();
        const cleanedData = removeRedundant(data);
        setTimetable(cleanedData);
      } catch (error) {
        console.error("Error fetching timetable data:", error);
      }
    };

    getTimetableData();
  }, []);

  // Parse the timetable data and build a Trie data structure
  useEffect(() => {
    const trie = new TrieSearch("courseCode");
    trie.addAll(timetable);
    if (courseNameOrID.trim() !== "") {
      const results = trie.get(courseNameOrID);
      setSearchResults(
        results.filter((course) => !selectedCourses.includes(course)) || [],
      );
    } else {
      setSearchResults([]);
    }
  }, [courseNameOrID, selectedCourses, timetable]);

  return (
    <div>
      <TextField
        id="search"
        label="Enter Course ID"
        variant="filled"
        onChange={(e) => setCourseNameOrID(e.target.value.toUpperCase())}
      />
      {courseNameOrID.length > 0 && (
        <DisplayCourses courses={searchResults} addToSelected={addToSelected} />
      )}
    </div>
  );
}

SearchCourse.propTypes = {
  addToSelected: PropTypes.func.isRequired,
  selectedCourses: PropTypes.arrayOf(PropTypes.object).isRequired,
};
