// src/components/dashboard/AnalyticsCharts.js
import React from 'react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement
} from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement
);

const AnalyticsCharts = ({ statsData }) => {
  if (!statsData) return <p>No analytics data available.</p>;

  const { clicksOverTime, deviceBrowserStats } = statsData;

  // --- Clicks Over Time Chart ---
  const lineChartData = {
    labels: clicksOverTime.map(item => item._id), // Dates (YYYY-MM-DD)
    datasets: [
      {
        label: 'Clicks per Day (Last 30 Days)',
        data: clicksOverTime.map(item => item.count),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  // --- Browser Chart ---
  const browserData = {
    labels: Object.keys(deviceBrowserStats.browsers),
    datasets: [{
      label: 'Browsers',
      data: Object.values(deviceBrowserStats.browsers),
      backgroundColor: [ // Add more colors as needed
        'rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)', 'rgba(153, 102, 255, 0.7)', 'rgba(255, 159, 64, 0.7)',
      ],
       borderWidth: 1,
    }],
  };

  // --- OS Chart ---
   const osData = {
       labels: Object.keys(deviceBrowserStats.os),
       datasets: [{
           label: 'Operating Systems',
           data: Object.values(deviceBrowserStats.os),
           backgroundColor: [ // Use different colors or reuse
              'rgba(54, 162, 235, 0.7)', 'rgba(255, 159, 64, 0.7)', 'rgba(153, 102, 255, 0.7)',
              'rgba(255, 99, 132, 0.7)', 'rgba(75, 192, 192, 0.7)', 'rgba(255, 206, 86, 0.7)',
           ],
            borderWidth: 1,
       }],
   };

  const chartOptions = { responsive: true, maintainAspectRatio: false };

  return (
    <div className="space-y-8">
      {/* Clicks Over Time */}
      <div>
         <h4 className="mb-2 text-md font-semibold">Clicks Over Time</h4>
         <div className="relative h-64"> {/* Set height for canvas container */}
            <Line options={chartOptions} data={lineChartData} />
         </div>
      </div>

      {/* Device/Browser Breakdown */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
         <div>
             <h4 className="mb-2 text-md font-semibold">Browsers</h4>
              <div className="relative h-64">
                 <Pie options={chartOptions} data={browserData} />
             </div>
         </div>
          <div>
              <h4 className="mb-2 text-md font-semibold">Operating Systems</h4>
               <div className="relative h-64">
                  <Pie options={chartOptions} data={osData} />
              </div>
          </div>
          {/* Could add Device chart similarly if data exists */}
      </div>
    </div>
  );
};

export default AnalyticsCharts;