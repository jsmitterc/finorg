"use client";

import { useState } from "react";
import { Card, CardContent, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";

// Dummy expense data
const allData = [
  { date: "2024-03-01", expense: 50 },
  { date: "2024-03-02", expense: 80 },
  { date: "2024-03-05", expense: 40 },
  { date: "2024-03-10", expense: 100 },
  { date: "2024-03-15", expense: 60 },
  { date: "2024-04-01", expense: 90 },
  { date: "2024-04-05", expense: 120 },
  { date: "2024-05-01", expense: 110 },
  { date: "2024-05-10", expense: 50 },
  { date: "2025-01-01", expense: 50 },
  { date: "2025-03-05", expense: 50 },
  { date: "2025-03-10", expense: 50 },
  { date: "2025-03-20", expense: 50 },
];

const filterData = (timeframe: string) => {
  const now = dayjs();
  
  switch (timeframe) {
    case "day":
      return allData.filter(d => dayjs(d.date).isSame(now, "day"));
    case "week":
      return allData.filter(d => dayjs(d.date).isSame(now, "week"));
    case "month":
      return allData.filter(d => dayjs(d.date).isSame(now, "month"));
    case "year":
      return allData.filter(d => dayjs(d.date).isSame(now, "year"));
    default:
      return allData; // "all-time"
  }
};

const MuiGraph = () => {
  const [timeframe, setTimeframe] = useState("all-time");

  const handleChange = (event: any) => {
    setTimeframe(event.target.value);
  };

  const filteredData = filterData(timeframe).map(d => ({
    name: dayjs(d.date).format("MMM D"),
    expense: d.expense,
  }));

  return (
    <Card sx={{ maxWidth: 700, mx: "auto", my: 3, p: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Expense Tracker
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Filter By</InputLabel>
          <Select value={timeframe} onChange={handleChange}>
            <MenuItem value="day">Day</MenuItem>
            <MenuItem value="week">Week</MenuItem>
            <MenuItem value="month">Month</MenuItem>
            <MenuItem value="year">Year</MenuItem>
            <MenuItem value="all-time">All Time</MenuItem>
          </Select>
        </FormControl>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="expense" fill="#d32f2f" barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MuiGraph;
