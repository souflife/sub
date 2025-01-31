import React, { useState, useEffect } from 'react';
import teachers from './teachers.json'; // Make sure this file is structured correctly
import './App.css'; // Import the CSS file
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const App = () => {
  const [absentTeachers, setAbsentTeachers] = useState([]);
  const [registeredTeachers, setRegisteredTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Function to mark a teacher as absent
  const markAbsent = () => {
    if (!selectedTeacher) {
      alert('Please select a teacher first');
      return;
    }

    if (!selectedDate) {
      alert('Please select a date first');
      return;
    }

    // Find the teacher in the teachers list by ID
    const teacher = teachers.find(t => t.id.toString() === selectedTeacher);
    
    if (!teacher) {
      console.error('Teacher not found for selected ID:', selectedTeacher);
      return;
    }

    console.log('Marking teacher absent:', teacher, 'on date:', selectedDate);

    // Add the teacher to the absentTeachers state
    setAbsentTeachers(prevData => [
      ...prevData,
      {
        name: teacher.fullName,
        subject: teacher.subject,
        date: selectedDate
      }
    ]);

    // Reset the dropdown and date
    setSelectedTeacher('');
    setSelectedDate('');
  };

  // Function to export absent teacher data to Excel
  const exportToExcel = () => {
    if (absentTeachers.length === 0) {
      alert('No absent teachers to export.');
      return;
    }

    console.log('Exporting absent teachers:', absentTeachers);

    const worksheet = XLSX.utils.json_to_sheet(absentTeachers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Absent Teachers");

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'absent_teachers.xlsx');
  };

  // Function to print the list of absent teachers
  const printAbsentTeachers = () => {
    console.log('Printing absent teachers:', absentTeachers);
    window.print();
  };

  // Function to simulate registering absent teachers online
  const registerOnline = async () => {
    try {
      setRegisteredTeachers(prevData => [...prevData, ...absentTeachers]);
      alert('Absent teachers registered online successfully');
    } catch (error) {
      console.error('Error registering absent teachers online:', error);
      alert('Error registering absent teachers online');
    }
  };

  // Function to fetch registered teachers
  const fetchRegisteredTeachers = async () => {
    try {
      setRegisteredTeachers(registeredTeachers);
    } catch (error) {
      console.error('Error fetching registered teachers:', error);
      alert('Error fetching registered teachers');
    }
  };

  // Function to download registered teachers as Excel
  const downloadRegisteredTeachers = () => {
    if (registeredTeachers.length === 0) {
      alert('No registered teachers to download.');
      return;
    }
    console.log('Downloading registered teachers:', registeredTeachers);

    const worksheet = XLSX.utils.json_to_sheet(registeredTeachers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registered Teachers");

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'registered_teachers.xlsx');
  };

  useEffect(() => {
    fetchRegisteredTeachers();
  }, []);

  return (
    <div className="container">
      <h1>Absent Teachers</h1>
      <div className="controls">
        {/* Teacher selection dropdown */}
        <select 
          value={selectedTeacher} 
          onChange={(e) => setSelectedTeacher(e.target.value)}
          className="teacher-select"
        >
          <option value="">Select Teacher</option>
          {teachers.map(teacher => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.fullName} - {teacher.subject}
            </option>
          ))}
        </select>

        {/* Date selection */}
        <input 
          type="date" 
          value={selectedDate} 
          onChange={(e) => setSelectedDate(e.target.value)} 
          className="date-select"
        />

        {/* Mark as absent button */}
        <button onClick={markAbsent} className="mark-absent-btn">
          Mark Absent
        </button>
      </div>

      {/* List of absent teachers */}
      <div className="absent-teachers">
        <h2>List of Absent Teachers</h2>
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Subject</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {absentTeachers.map((teacher, index) => (
              <tr key={index}>
                <td>{teacher.name}</td>
                <td>{teacher.subject}</td>
                <td>{teacher.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="actions">
        <button onClick={printAbsentTeachers} className="action-btn">Print</button>
        <button onClick={exportToExcel} className="action-btn">Export to Excel</button>
        <button onClick={registerOnline} className="action-btn">Register Online</button>
      </div>

      {/* Registered teachers */}
      <div className="registered-teachers">
        <h2>Registered Teachers</h2>
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Subject</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {registeredTeachers.map((teacher, index) => (
              <tr key={index}>
                <td>{teacher.name}</td>
                <td>{teacher.subject}</td>
                <td>{teacher.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={downloadRegisteredTeachers} className="action-btn">
          Download Registered Teachers
        </button>
      </div>
    </div>
  );
};

export default App;
