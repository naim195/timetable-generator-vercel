import { useState, useRef } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Tooltip,
  Alert,
  Box,
} from "@mui/material";
import timetableSlots from "../timetable_slots.json";
import "../styles/timetable.css";
import html2canvas from "html2canvas";
import PropTypes from "prop-types";

const Timetable = ({ selectedCourses }) => {
  const slotToCourse = {};
  const clashingCourses = new Set();
  let notAdded = new Set();

  selectedCourses.forEach((course) => {
    if (course.Lecture && course.Lecture.length > 0) {
      course.Lecture.forEach((slot) => {
        slot = slot.trim();
        if (slotToCourse[slot]) {
          clashingCourses.add(course["Course Code"]);
          clashingCourses.add(slotToCourse[slot]);
        } else {
          slotToCourse[slot] = course["Course Code"];
        }
      });
    }

    if (course.Tutorial && course.Tutorial.length > 0) {
      if (course.Tutorial.length <= 2) {
        course.Tutorial.forEach((slot) => {
          slot = slot.trim();
          if (slotToCourse[slot]) {
            clashingCourses.add(course["Course Code"]);
            clashingCourses.add(slotToCourse[slot]);
          } else {
            slotToCourse[slot] = `${course["Course Code"]}(T)`;
          }
        });
      } else {
        notAdded.add(course["Course Code"]);
      }
    }

    if (course.Lab && course.Lab.length > 0) {
      if (course.Lab.length <= 2) {
        course.Lab.forEach((slot) => {
          slot = slot.trim();
          if (slotToCourse[slot]) {
            clashingCourses.add(course["Course Code"]);
            clashingCourses.add(slotToCourse[slot]);
          } else {
            slotToCourse[slot] = `${course["Course Code"]}(Lab)`;
          }
        });
      } else {
        notAdded.add(course["Course Code"]);
      }
    }
  });

  const [copied, setCopied] = useState(false);
  const tableRef = useRef(null);

  const copyToClipboard = () => {
    const headerRow = [
      "Time Slot",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
    ].join("\t");
    const tableContent = [headerRow]
      .concat(
        timetableSlots.map((slot) => {
          return [
            slot.Slot,
            slotToCourse[slot.M] || slot.M,
            slotToCourse[slot.T] || slot.T,
            slotToCourse[slot.W] || slot.W,
            slotToCourse[slot.Th] || slot.Th,
            slotToCourse[slot.F] || slot.F,
          ].join("\t");
        }),
      )
      .join("\n");

    navigator.clipboard.writeText(tableContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const captureScreenshot = () => {
    html2canvas(tableRef.current).then(function (canvas) {
      const screenshot = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = screenshot;
      link.download = "timetable.png";
      link.click();
    });
  };

  return (
    <div>
      <Box display="flex" flexDirection="column" gap={2}>
        {clashingCourses.size > 0 && (
          <Alert severity="warning" variant="outlined">
            <strong>Warning:</strong> The following courses are clashing:{" "}
            {Array.from(clashingCourses).join(", ")}
          </Alert>
        )}
        {notAdded.size > 0 && (
          <Alert severity="warning" variant="outlined">
            <strong>Attention Needed:</strong> The following courses require
            manual addition of lab/tutorial slots due to multiple sections:{" "}
            {Array.from(notAdded).join(", ")}. Please add the correct slots for
            these courses as per your section.
          </Alert>
        )}
      </Box>
      <h3>
        Note: Lab/tutorial slots for courses with multiple sections will not
        appear for you given slot in the timetable. Please add your lab slot
        manually for such courses.
      </h3>
      <Table ref={tableRef} className="table">
        <TableHead>
          <TableRow>
            <TableCell className="text-center">Time Slot</TableCell>
            <TableCell className="text-center">Monday</TableCell>
            <TableCell className="text-center">Tuesday</TableCell>
            <TableCell className="text-center">Wednesday</TableCell>
            <TableCell className="text-center">Thursday</TableCell>
            <TableCell className="text-center">Friday</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {timetableSlots.map((slot, index) => (
            <TableRow key={index}>
              <TableCell className="text-center">{slot.Slot}</TableCell>
              <TableCell className="text-center">
                {slotToCourse[slot.M] || slot.M}
              </TableCell>
              <TableCell className="text-center">
                {slotToCourse[slot.T] || slot.T}
              </TableCell>
              <TableCell className="text-center">
                {slotToCourse[slot.W] || slot.W}
              </TableCell>
              <TableCell className="text-center">
                {slotToCourse[slot.Th] || slot.Th}
              </TableCell>
              <TableCell className="text-center">
                {slotToCourse[slot.F] || slot.F}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="btn-container">
        <Tooltip
          title="Paste this in Google Sheets to modify it."
          sx={{ fontSize: "0.9rem" }}
        >
          <Button
            variant="contained"
            onClick={copyToClipboard}
            className="copy"
          >
            {copied ? "Copied!" : "Copy to Clipboard"}
          </Button>
        </Tooltip>

        <Button
          sx={{ fontSize: "0.9rem" }}
          variant="contained"
          onClick={captureScreenshot}
          className="screenshot"
        >
          Take Screenshot
        </Button>
      </div>
    </div>
  );
};

Timetable.propTypes = {
  selectedCourses: PropTypes.arrayOf(
    PropTypes.shape({
      "Course Code": PropTypes.string.isRequired,
      "Course Name": PropTypes.string.isRequired,
      Lecture: PropTypes.arrayOf(PropTypes.string),
      Tutorial: PropTypes.arrayOf(PropTypes.string),
      Lab: PropTypes.arrayOf(PropTypes.string),
    }),
  ).isRequired,
};

export default Timetable;
