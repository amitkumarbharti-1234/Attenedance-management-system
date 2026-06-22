import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
} from "@mui/material";

const StudentDashboard = () => {
  const [sessionCodeInput, setSessionCodeInput] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");

  const markAttendance = () => {
    const storedSessionCode = localStorage.getItem("sessionCode");
    const currentCourse = localStorage.getItem("currentCourse");
    const today = new Date().toISOString().split("T")[0];

    if (sessionCodeInput === storedSessionCode && currentCourse) {
      const attendanceRecords = JSON.parse(localStorage.getItem("attendanceRecords") || "[]");

      const alreadyMarkedToday = attendanceRecords.some(
        record =>
          record.rollNo === rollNo &&
          record.course === currentCourse &&
          record.date === today
      );

      if (alreadyMarkedToday) {
        setError("Attendance already marked for today.");
        return;
      }

      const newRecord = {
        rollNo,
        name,
        course: currentCourse,
        status: "Present",
        date: today
      };

      attendanceRecords.push(newRecord);
      localStorage.setItem("attendanceRecords", JSON.stringify(attendanceRecords));
      setStatus("Present");
      setError("");
    } else {
      setError("Invalid session code. Please check again.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Student Dashboard
      </Typography>
      <Card style={{ padding: "20px" }}>
        <CardContent>
          <TextField
            label="Enter Session Code"
            value={sessionCodeInput}
            onChange={(e) => setSessionCodeInput(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Roll Number"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={markAttendance}
            style={{ marginTop: "20px" }}
          >
            Mark Attendance
          </Button>

          {status && (
            <Typography color="green" style={{ marginTop: "20px" }}>
              ✅ Attendance marked successfully!
            </Typography>
          )}

          {error && (
            <Typography color="red" style={{ marginTop: "20px" }}>
              ❌ {error}
            </Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
