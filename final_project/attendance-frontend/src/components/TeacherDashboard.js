import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem
} from "@mui/material";
import * as XLSX from "xlsx";

const courses = ["Data-Science", "Machine-Learning", "Data-Structure"];

const TeacherDashboard = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [sessionCode, setSessionCode] = useState(localStorage.getItem("sessionCode") || null);
  const [courseAttendance, setCourseAttendance] = useState({});
  const [studentPresenceCount, setStudentPresenceCount] = useState({});
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const currentCourse = localStorage.getItem("currentCourse");
    if (currentCourse) setSelectedCourse(currentCourse);
  }, []);

  const handleCourseChange = (event) => {
    const course = event.target.value;
    setSelectedCourse(course);
    setCourseAttendance({});
    setSelectedDate("");
    localStorage.setItem("currentCourse", course);
  };

  const startSession = () => {
    const newSessionCode = Math.floor(100000 + Math.random() * 900000).toString();
    setSessionCode(newSessionCode);
    localStorage.setItem("sessionCode", newSessionCode);
    localStorage.setItem("currentCourse", selectedCourse);
  };

  const endSession = () => {
    setSessionCode(null);
    localStorage.removeItem("sessionCode");
  };

  useEffect(() => {
    if (selectedCourse) {
      const storedRecords = JSON.parse(localStorage.getItem("attendanceRecords") || "[]");
      const filtered = storedRecords.filter(record => record.course === selectedCourse);
      const updatedCount = {};
      const uniqueDays = new Set();
      const dateSet = new Set();

      filtered.forEach(student => {
        const key = `${selectedCourse}_${student.rollNo}`;
        const dateKey = `${key}_${student.date}`;
        if (student.status === "Present" && !uniqueDays.has(dateKey)) {
          updatedCount[key] = (updatedCount[key] || 0) + 1;
          uniqueDays.add(dateKey);
        }
        if (student.date) dateSet.add(student.date);
      });

      setAvailableDates([...dateSet].sort());
      setCourseAttendance(prev => ({ ...prev, [selectedCourse]: filtered }));
      setStudentPresenceCount(updatedCount);
    }
  }, [selectedCourse, sessionCode]);

  const students = (courseAttendance[selectedCourse] || []).filter(s => selectedDate ? s.date === selectedDate : true);
  const totalPresent = students.filter(s => s.status === "Present").length;
  const totalAbsent = students.filter(s => s.status === "Absent").length;

  const exportDateToExcel = () => {
    const exportData = students.map(record => {
      const key = `${selectedCourse}_${record.rollNo}`;
      return {
        Date: record.date,
        RollNo: record.rollNo,
        Name: record.name,
        Status: record.status,
        NumericStatus: record.status === "Present" ? 1 : 0,
        TotalPresent: studentPresenceCount[key] || 0
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${selectedCourse}_${selectedDate}`);
    XLSX.writeFile(wb, `${selectedCourse}_Attendance_${selectedDate}.xlsx`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>Teacher Dashboard</Typography>

      <Typography variant="h6">Select Course:</Typography>
      <Select
        value={selectedCourse}
        onChange={handleCourseChange}
        displayEmpty
        style={{ marginBottom: "20px", width: "200px" }}
      >
        <MenuItem value="" disabled>Select a course</MenuItem>
        {courses.map(course => (
          <MenuItem key={course} value={course}>{course}</MenuItem>
        ))}
      </Select>

      {selectedCourse && (
        <>
          {!sessionCode ? (
            <Button variant="contained" color="primary" onClick={startSession}>
              Start Attendance Session for {selectedCourse}
            </Button>
          ) : (
            <Card style={{ marginTop: "20px", padding: "15px" }}>
              <CardContent>
                <Typography variant="h5">Session Code: {sessionCode}</Typography>
                <Typography variant="subtitle1">Course: {selectedCourse}</Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={endSession}
                  style={{ marginTop: "10px" }}
                >
                  End Session
                </Button>
              </CardContent>
            </Card>
          )}

          <Typography variant="h6" style={{ marginTop: "20px" }}>Select Date:</Typography>
          <Select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            displayEmpty
            style={{ marginBottom: "20px", width: "200px" }}
          >
            <MenuItem value="" disabled>Select a date</MenuItem>
            {availableDates.map(date => (
              <MenuItem key={date} value={date}>{date}</MenuItem>
            ))}
          </Select>

          {selectedDate && (
            <>
              <Typography variant="h6">Attendance on {selectedDate}:</Typography>
              <Table style={{ marginTop: "10px" }}>
                <TableHead>
                  <TableRow>
                    <TableCell><b>Roll No</b></TableCell>
                    <TableCell><b>Name</b></TableCell>
                    <TableCell><b>Status</b></TableCell>
                    <TableCell><b>Numeric Status</b></TableCell>
                    <TableCell><b>Total Present</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student, index) => {
                    const key = `${selectedCourse}_${student.rollNo}`;
                    return (
                      <TableRow key={index}>
                        <TableCell>{student.rollNo}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.status}</TableCell>
                        <TableCell>{student.status === "Present" ? 1 : 0}</TableCell>
                        <TableCell>{studentPresenceCount[key] || 0}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <Typography variant="subtitle1" style={{ marginTop: "15px" }}>
                ✅ Total Present: {totalPresent} &nbsp;&nbsp; ❌ Total Absent: {totalAbsent}
              </Typography>

              <Button
                variant="contained"
                color="success"
                onClick={exportDateToExcel}
                style={{ marginTop: "20px" }}
              >
                Export Attendance for {selectedDate}
              </Button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default TeacherDashboard;
