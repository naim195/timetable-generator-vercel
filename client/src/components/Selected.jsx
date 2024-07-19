import PropTypes from "prop-types";
import { Button, List, ListItem, ListItemText } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const Selected = ({
  selectedCourses,
  setSelectedCourses,
  generateTable,
  setGenerateTable,
}) => {
  const handleDelete = (courseToDelete) => {
    setSelectedCourses(
      selectedCourses.filter((course) => course !== courseToDelete),
    );
  };

  return (
    <div>
      <h2>Selected Courses</h2>
      <List>
        {selectedCourses.map((course, index) => (
          <ListItem key={index} dense>
            <ListItemText
              primary={`${course["Course Code"]}: ${course["Course Name"]}`}
            />
            <DeleteIcon onClick={() => handleDelete(course)} />
          </ListItem>
        ))}
      </List>
      {selectedCourses.length > 0 && (
        <Button
          variant="contained"
          onClick={() => setGenerateTable(generateTable === -1 ? 1 : 1)}
        >
          Generate Timetable
        </Button>
      )}
    </div>
  );
};

Selected.propTypes = {
  selectedCourses: PropTypes.arrayOf(
    PropTypes.shape({
      "Course Code": PropTypes.string.isRequired,
      "Course Name": PropTypes.string.isRequired,
    }),
  ).isRequired,
  setSelectedCourses: PropTypes.func.isRequired,
  generateTable: PropTypes.number.isRequired,
  setGenerateTable: PropTypes.func.isRequired,
};

export default Selected;
