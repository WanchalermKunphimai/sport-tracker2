import React, { useState, useEffect } from "react";
import axios from "axios";

const PROXY_URL = "http://localhost:8080/";
const API_TOKEN =
  "BujBVYCXEixHZf3TNhNX4enX530mgdG0f1aV2OZn1JoRgdRuQfMJyM3GcHFh"; // Replace with your SportMonks API token
const LEAGUES_URL = `https://api.sportmonks.com/v3/football/leagues?api_token=${API_TOKEN}&include=currentSeason`;
const SEASON_URL = `https://api.sportmonks.com/v3/football/seasons/:seasonId?api_token=${API_TOKEN}&include=teams`;

function SeasonAndTeamSelector() {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("");
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the list of leagues
    axios
      .get(LEAGUES_URL)
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setLeagues(response.data.data);
          console.log("API output League", response.data.data);
        } else {
          console.error("Invalid response data structure for leagues");
        }
      })
      .catch((error) => {
        console.error("Error fetching leagues:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Fetch season data based on the selected league
    if (selectedLeague) {
      console.log("selectedLeague", selectedLeague);
      console.log("leagues: ", leagues);
      const seasonId = leagues.find(
        (league) => league.id === parseInt(selectedLeague)
      )?.currentseason?.id;
      console.log("seasonID: ", seasonId);
      if (seasonId) {
        axios
          .get(SEASON_URL.replace(":seasonId", seasonId))
          .then((response) => {
            if (response.data && response.data.data.teams) {
              setTeams(response.data.data.teams);
              console.log("API season response", teams);
            } else {
              console.error("Invalid response data structure for season");
            }
          })
          .catch((error) => {
            console.error("Error fetching season:", error);
          });
      }
    }
  }, [selectedLeague]);

  const handleLeagueChange = (event) => {
    setSelectedLeague(event.target.value);
    setSelectedSeason(""); // Reset selected season when league changes
  };

  const handleSeasonChange = (event) => {
    setSelectedSeason(event.target.value);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Select a League and Season</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <label className="block">Select a League:</label>
          <select
            value={selectedLeague}
            onChange={handleLeagueChange}
            className="w-full p-2 border rounded mt-2"
          >
            <option value="">Select a league</option>
            {leagues.map((league) => (
              <option key={league.id} value={league.id}>
                {league.name}
              </option>
            ))}
          </select>
          {selectedLeague && (
            <div className="mt-4">
              <label className="block">Select a Season:</label>
              <div className="mt-2">
                {teams.length > 0 ? (
                  teams.map((team) => (
                    <div key={team.id} className="flex items-center mb-2">
                      <img
                        src={team.image_path}
                        alt={team.name}
                        className="w-8 h-8 mr-2"
                      />
                      <span>{team.name}</span>
                    </div>
                  ))
                ) : (
                  <div>No teams available for the selected season.</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SeasonAndTeamSelector;
