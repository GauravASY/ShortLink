import React, { useEffect, useState } from "react";
import "../Link/Link.css";
import copy from "../../src/assets/copy.png";
import axios from "axios";

function Analytics() {
  const token = localStorage.getItem("token");
  const [analytics, setAnalytics] = useState([]);

  useEffect(() => {
    if (token !== undefined) {
      getAnalytics();
    }
  }, [token]);

  async function getAnalytics() {
    if (!token) {
      return;
    }
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/analytics`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (data.success) {
        setAnalytics(data.links);
      } else {
        console.log(data.msg);
      }
    } catch (error) {}
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Original Link</th>
            <th>Short Link</th>
            <th>IP address</th>
            <th>User Device</th>
          </tr>
        </thead>
        <tbody>
          {analytics.map((data, index) => (
            <tr key={index}>
              <td>
                {new Date(data.createdAt)
                  .toLocaleString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })
                  .replace(",", "")}
              </td>

              <td>
                <a
                  href={data.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data.originalUrl}
                </a>
              </td>
              <td>
                <a
                  href={data.shortId}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data.shortId}
                </a>
                <img
                  src={copy}
                  alt="Copy"
                  onClick={() => navigator.clipboard.writeText(data.shortId)}
                />
              </td>
              <td>{data.ipAddress}</td>
              <td>{data.userDevice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Analytics;
