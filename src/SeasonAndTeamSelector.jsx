import React, { useState, useEffect } from "react";
import axios from "axios";
import FavoriteTeam from "./FavoriteTeam";
import { Link } from "react-router-dom";

const PROXY_URL = "http://localhost:8080/";
const API_TOKEN = "BujBVYCXEixHZf3TNhNX4enX530mgdG0f1aV2OZn1JoRgdRuQfMJyM3GcHFh"; // Replace with your SportMonks API token
const LEAGUES_URL = `https://api.sportmonks.com/v3/football/leagues?api_token=${API_TOKEN}&include=currentSeason`;
const SEASON_URL = `https://api.sportmonks.com/v3/football/seasons/:seasonId?api_token=${API_TOKEN}&include=teams`;

function SeasonAndTeamSelector({ favoriteTeams, setFavoriteTeams, teams, setTeams }) {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("");

  // Load favorite teams from local storage when the component initially mounts
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteTeams");
    if (storedFavorites) {
      setFavoriteTeams(JSON.parse(storedFavorites));
    }
  }, []);

  // Save favorite teams to local storage whenever favoriteTeams state changes
  useEffect(() => {
    localStorage.setItem("favoriteTeams", JSON.stringify(favoriteTeams));
  }, [favoriteTeams]);

  // Fetch the list of leagues when the component mounts
  useEffect(() => {
    axios
      .get(LEAGUES_URL)
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setLeagues(response.data.data);
        } else {
          console.error("Invalid response data structure for leagues");
        }
      })
      .catch((error) => {
        console.error("Error fetching leagues:", error);
      });
  }, []);

  console.log('leagues', leagues);
  // Fetch season data based on the selected league
  useEffect(() => {
    if (selectedLeague) {
      const seasonId = leagues.find(
        (league) => league.id === parseInt(selectedLeague)
      )?.currentseason?.id;

      if (seasonId) {
        axios
          .get(SEASON_URL.replace(":seasonId", seasonId))
          .then((response) => {
            if (response.data && response.data.data.teams) {
              setTeams(response.data.data.teams);
            } else {
              console.error("Invalid response data structure for season");
            }
          })
          .catch((error) => {
            console.error("Error fetching season:", error);
          });
      }
    }
  }, [selectedLeague, leagues, setTeams]);

  console.log('teams', teams);

  // Toggle favorite status of a team
  const toggleFavoriteTeam = (teamId) => {
    if (favoriteTeams.includes(teamId)) {
      setFavoriteTeams(favoriteTeams.filter((id) => id !== teamId));
    } else {
      setFavoriteTeams([...favoriteTeams, teamId]);
    }
  };

  // Check if a team is a favorite
  const isFavoriteTeam = (teamId) => {
    return favoriteTeams.includes(teamId);
  };

  // Handle league selection
  const handleLeagueChange = (event) => {
    setSelectedLeague(event.target.value);
    setSelectedSeason("");
    setTeams({ ...teams, name: event.target.value });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Select a League and Season</h2>
      <label className="block">Select a League:</label>
      <select
        value={selectedLeague}
        onChange={handleLeagueChange}
        className="w-full p-2 border rounded mt-2"
      >
        <option value="">Select a league</option>
        {leagues.map((league) => (
          <option key={league.id} value={league.id}> {/* Pass the team name as the value */}
            {league.name}
          </option>
        ))}
      </select>
      {selectedLeague && (
        <div className="mt-4">
          <label className="block">Select a Team:</label>
          <div className="mt-2">
            {teams.length > 0 ? (
              teams.map((team) => (
                <div key={team.id} className="flex items-center mb-2">
                  <button
                    onClick={() => toggleFavoriteTeam(team.id)}
                    className={`${
                      isFavoriteTeam(team.id) ? "text-yellow-500" : "text-gray-500"
                    } mr-2`}
                    style={{ fontSize: "1.8em" }}
                  >
                    &#9733; {/* Star icon */}
                  </button>
                  <img src={team.image_path} alt={team.name} className="w-12 h-12 mr-2" />
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
  );
}

export default SeasonAndTeamSelector;