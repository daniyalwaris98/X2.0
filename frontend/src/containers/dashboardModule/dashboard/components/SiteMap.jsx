import React, { useState, useEffect } from 'react';

const SiteMap = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulating fetching data from an API
    const fetchData = async () => {
      try {
        // Replace this with your actual API call to fetch data
        const response = await fetch('http://192.168.10.147:3010/api/v1/main_dashboard/main_phy_leaf_let');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Render the data
  return (
    <div>
      <h1>Site Map</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SiteMap;
