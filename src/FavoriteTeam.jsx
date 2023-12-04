import React, { useState, useEffect } from "react";
import axios from "axios";

const PROXY_URL = "http://localhost:8080/";
const API_TOKEN =
  "BujBVYCXEixHZf3TNhNX4enX530mgdG0f1aV2OZn1JoRgdRuQfMJyM3GcHFh";

function FavoriteTeam({ favoriteTeams, setFavoriteTeams }) {
  const [teamsData, setTeamsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const removeFavoriteTeam = (teamIdToRemove) => {
    const updatedFavoriteTeams = favoriteTeams.filter((teamId) => teamId !== teamIdToRemove);
    // Perform any additional logic here, like updating state or localStorage
    console.log("Team removed:", teamIdToRemove);
    // Update state with the updated favoriteTeams array
    setFavoriteTeams(updatedFavoriteTeams);
  };

  useEffect(() => {
    const fetchTeamData = async () => {
      setIsLoading(true);
      const teamDataPromises = favoriteTeams.map((teamId) => {
        const TEAMBYID_URL = `https://api.sportmonks.com/v3/football/teams/${teamId}?api_token=${API_TOKEN}`;
        return axios.get(TEAMBYID_URL);
      });

      try {
        const responses = await Promise.all(teamDataPromises);
        const teamsInfo = responses.map((response) => response.data.data);
        setTeamsData(teamsInfo);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeamData();
  }, [favoriteTeams]);

  const calculateImageDimensions = () => {
    const availableWidth = window.innerWidth;
    const isSmallScreen = availableWidth <= 640; // Adjust this threshold as needed

    let imageWidth;
    if (isSmallScreen) {
      const numberOfColumns = 4; // Adjust based on the desired number of columns
      const gutter = 8;
      const totalGutterWidth = gutter * (numberOfColumns - 1);
      imageWidth = (availableWidth - totalGutterWidth) / numberOfColumns;
    } else {
      const numberOfColumns = 16; // Number of columns for larger screens
      const gutter = 8;
      const totalGutterWidth = gutter * (numberOfColumns - 1);
      imageWidth = (availableWidth - totalGutterWidth) / numberOfColumns;
    }

    return { width: imageWidth, height: "auto", maxWidth: "100%" };
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center p-3">Favorite Teams</h2>
      {isLoading ? (
        <p className="text-3xl text-center font-bold p-5 text-slate-500">
          Loading...
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {teamsData.map((team) => (
            <div
              key={team.id}
              className="bg-gray-200 p-2 m-2 gap-2 rounded-lg hover:bg-orange-300 relative"
            >
              <button
                onClick={() => removeFavoriteTeam(team.id)} // Function to remove team ID
                className="absolute top-0 right-0 p-1 rounded-full bg-red-500 text-white text-xs"
              >
                Remove
              </button>
              <img
                src={team.image_path}
                alt={team.name}
                style={calculateImageDimensions()}
                className="mx-auto"
              />
              <p className="text-center font-semibold text-lg p-1">
                {team.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoriteTeam;
