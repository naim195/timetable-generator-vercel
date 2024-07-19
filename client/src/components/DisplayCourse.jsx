import { Button } from "@mui/material";
import "../styles/dispcourses.css";
import PropTypes from "prop-types";

const DisplayCourses = ({ courses, addToSelected }) => {
  return (
    <div className="coursesContainer">
      {courses.map((course) => (
        <div key={course["Course Code"]}>
          <Button variant="text" onClick={() => addToSelected(course)}>
            {course["Course Code"]}: {course["Course Name"]}
          </Button>
        </div>
      ))}
    </div>
  );
};

DisplayCourses.propTypes = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      "Course Code": PropTypes.string.isRequired,
      "Course Name": PropTypes.string.isRequired,
    }),
  ).isRequired,
  addToSelected: PropTypes.func.isRequired,
};

export default DisplayCourses;
