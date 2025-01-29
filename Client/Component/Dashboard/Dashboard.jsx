import React from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./Dashboard.css";

const Dashboard = () => {
  // Sample data
  const totalClicks = 1234;
  const dateWiseClicks = [
    { date: "21-01-25", clicks: 1234 },
    { date: "20-01-25", clicks: 1140 },
    { date: "19-01-25", clicks: 134 },
    { date: "18-01-25", clicks: 34 },
  ];
  const deviceClicks = [
    { device: "Mobile", clicks: 134 },
    { device: "Desktop", clicks: 40 },
    { device: "Tablet", clicks: 3 },
  ];


  const dateWiseData = {
    labels: dateWiseClicks.map((item) => item.date),
    datasets: [
      {
        label: "Clicks",
        data: dateWiseClicks.map((item) => item.clicks),
        backgroundColor: "#1B48DA",
         barThickness: 20,
      },
    ],
  };

  const deviceData = {
    labels: deviceClicks.map((item) => item.device),
    datasets: [
      {
        label: "Clicks",
        data: deviceClicks.map((item) => item.clicks),
        backgroundColor: "#1B48DA",
        barThickness: 20,
      },
    ],
  };

  const options = {
    responsive: true,
    indexAxis: "y", 
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#000",
          font: {
            size: 18,
            family: "Manrope",
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="dashboard-container" style={{ padding: "16px" }}>
      <h1 className="headings" style={{ fontSize: "24px", marginBottom: "64px" }}>
        Total Clicks:{" "}
        <span style={{ color: "#007bff", fontWeight: "bold" }}>
          {totalClicks}
        </span>
      </h1>
      <div className="dashboard-grid" style={{ display: "flex", gap: "16px", flexGrow:'1' }}>
        <div
          className="card text"
          style={{
            flex: 1,
            padding: "16px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor:'white'
          }}
        >
          <h2 style={{ fontSize: "18px", marginBottom: "12px", color:'#1B48DA' }}>
            Date-wise Clicks
          </h2>
          <div style={{ height: "200px" }}>
            <Bar data={dateWiseData} options={options} />
          </div>
        </div>

        {/* Click Devices Card */}
        <div
          className="card text"
          style={{
            flex: 1,
            padding: "16px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor:'white'
          }}
        >
          <h2 style={{ fontSize: "18px", marginBottom: "12px", color :'#1B48DA' }}>
            Click Devices
          </h2>
          <div className="text" style={{ height: "200px" }}>
            <Bar data={deviceData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
