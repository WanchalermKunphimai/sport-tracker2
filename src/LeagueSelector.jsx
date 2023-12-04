import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PROXY_URL = 'http://localhost:8080/';
const API_URL = 'https://api.sportmonks.com/v3/football/seasons?api_token=BujBVYCXEixHZf3TNhNX4enX530mgdG0f1aV2OZn1JoRgdRuQfMJyM3GcHFh&include=teams';
const FULL_API_URL = `${API_URL}`;

function LeagueSelector({ onSeasonSelect }) {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(FULL_API_URL)
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setSeasons(response.data.data);
        } else {
          console.error('Invalid response data structure for seasons');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching seasons:', error);
        setLoading(false);
      });
  }, []);

  const handleSeasonChange = (event) => {
    setSelectedSeason(event.target.value);
    onSeasonSelect(event.target.value);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Select a Season</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <label className="block">Select a Season:</label>
          <select
            value={selectedSeason}
            onChange={handleSeasonChange}
            className="w-full p-2 border rounded mt-2"
          >
            <option value="">Select a season</option>
            {seasons.map((season) => (
              <option key={season.id} value={season.id}>
                {season.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

export default LeagueSelector;
