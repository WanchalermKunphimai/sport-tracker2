import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./Header";
import SeasonAndTeamSelector from "./SeasonAndTeamSelector";
import FavoriteTeam from "./FavoriteTeam";
import axios from "axios";
import SharedState from "./SharedState";
import FootballFixtures from "./Fixtures";
import Schedule from "./Schedule";

const PROXY_URL = "http://localhost:8080/";
const API_TOKEN =
  "BujBVYCXEixHZf3TNhNX4enX530mgdG0f1aV2OZn1JoRgdRuQfMJyM3GcHFh"; // Replace with your SportMonks API token
const LEAGUES_URL = `https://api.sportmonks.com/v3/football/leagues?api_token=${API_TOKEN}&include=currentSeason`;
const SEASON_URL = `https://api.sportmonks.com/v3/football/seasons/:seasonId?api_token=${API_TOKEN}&include=teams`;

function App() {
  const headerHeight = 120;
  const [favoriteTeams, setFavoriteTeams] = useState(() => {
    const storedFavorites = localStorage.getItem("favoriteTeams");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  const removeTeam = (updatedFavoriteTeams) => {
    setFavoriteTeams(updatedFavoriteTeams);
    // Perform any additional logic, like updating localStorage, if needed
  };

  // Define the handleFavoriteTeamSelect function
  const handleFavoriteTeamSelect = (teamId) => {
    if (!favoriteTeams.includes(teamId)) {
      setFavoriteTeams([...favoriteTeams, teamId]);
    } else {
      setFavoriteTeams(favoriteTeams.filter((id) => id !== teamId));
    }
  };

  return (
    <Router>
      <div className="App">
        <SharedState>
          {(
            teams,
            setTeams,
            selectedLeague,
            setSelectedLeague,
            leagues,
            setLeagues
          ) => (
            <>
              <Header
                favoriteTeams={favoriteTeams}
                onFavoriteTeamSelect={handleFavoriteTeamSelect}
              />
              <div
                className="container mx-auto mt-0"
                style={{ paddingTop: `${headerHeight}px` }}
              >
                <Routes>
                  <Route
                    path="/"
                    element={
                      <SeasonAndTeamSelector
                        favoriteTeams={favoriteTeams}
                        setFavoriteTeams={setFavoriteTeams}
                        teams={teams}
                        setTeams={setTeams}
                        selectedLeague={selectedLeague}
                        setSelectedLeague={setSelectedLeague}
                        leagues={leagues}
                        setLeagues={setLeagues}
                      />
                    }
                  />
                  <Route
                    path="/favorite-teams"
                    element={
                      <FavoriteTeam
                        favoriteTeams={favoriteTeams}
                        removeTeam={removeTeam}
                        teams={teams}
                        setFavoriteTeams={setFavoriteTeams}
                      />
                    }
                  />
                  <Route
                    path="/fixture"
                    element={
                      <FootballFixtures
                        teams={teams}
                        favoriteTeams={favoriteTeams}
                      />
                    }
                  />
                  <Route
                    path="/schedule"
                    element={
                      <Schedule
                        teams={teams}
                        favoriteTeams={favoriteTeams}
                      />
                    }
                  />
                </Routes>
              </div>
            </>
          )}
        </SharedState>
      </div>
    </Router>
  );
}

export default App;