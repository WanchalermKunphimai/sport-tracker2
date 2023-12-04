import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const Schedule = ({ favoriteTeams }) => {
  const API_TOKEN =
    "BujBVYCXEixHZf3TNhNX4enX530mgdG0f1aV2OZn1JoRgdRuQfMJyM3GcHFh";
  const PROXY_URL = "http://localhost:8080/";
  const ALLTEAM_URL = `https://api.sportmonks.com/v3/football/teams?api_token=${API_TOKEN}`;
  const [scheduleData, setScheduleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allTeam, setAllTeam] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [searchedTeam, setSearchedTeam] = useState(""); 
  const [allScheduleData, setAllScheduleData] = useState([]);

  useEffect(() => {
    axios
      .get(ALLTEAM_URL)
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setAllTeam(response.data.data);
          setIsLoading(false);
        } else {
          console.error("Invalid response data structure for teams");
        }
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
      });
  }, []);

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        if (favoriteTeams.length > 0) {
          const promises = favoriteTeams.map(async (teamId) => {
            try {
              const scheduleURL = `https://api.sportmonks.com/v3/football/schedules/teams/${teamId}?api_token=${API_TOKEN}`;
              const response = await axios.get(scheduleURL);
              if (response.data && Array.isArray(response.data.data)) {
                return response.data.data;
              } else {
                console.error("Invalid response data structure");
                return [];
              }
            } catch (error) {
              console.error(
                `Error fetching schedule for team ID ${teamId}:`,
                error
              );
              return [];
            }
          });

          const allScheduleData = await Promise.all(promises);
          setScheduleData(allScheduleData.flat());
          setIsLoading(false);
          localStorage.setItem(
            "scheduleData",
            JSON.stringify(allScheduleData.flat())
          );
        }
      } catch (error) {
        console.error("Error fetching schedule data:", error);
      }
    };

    fetchScheduleData();
  }, [favoriteTeams]);

  const handleSearch = () => {
    if (searchedTeam.trim() === "") {
      // If the search field is empty, display all scheduleData
      setScheduleData(allScheduleData.flat());
    } else {
      const filteredData = allScheduleData
        .flat()
        .filter((fixture) => {
          const homeTeamName = fixture.participants.find(
            (team) => team.meta.location === "home"
          ).name;
          const awayTeamName = fixture.participants.find(
            (team) => team.meta.location === "away"
          ).name;
          return (
            homeTeamName.toLowerCase().includes(searchedTeam.toLowerCase()) ||
            awayTeamName.toLowerCase().includes(searchedTeam.toLowerCase())
          );
        });
      setScheduleData(filteredData);
    }
  };

  const handleFilter = async (selectedTeam) => {
    setSelectedTeam(selectedTeam);

    if (selectedTeam === "Your Favorite Team(s)") {
      const promises = favoriteTeams.map(async (teamId) => {
        try {
          const scheduleURL = `https://api.sportmonks.com/v3/football/schedules/teams/${teamId}?api_token=${API_TOKEN}`;
          const response = await axios.get(scheduleURL);
          if (response.data && Array.isArray(response.data.data)) {
            return response.data.data;
          } else {
            console.error("Invalid response data structure");
            return [];
          }
        } catch (error) {
          console.error(
            `Error fetching schedule for team ID ${teamId}:`,
            error
          );
          return [];
        }
      });

      try {
        const allScheduleData = await Promise.all(promises);
        setScheduleData(allScheduleData.flat());
        setIsLoading(false);
        localStorage.setItem(
          "scheduleData",
          JSON.stringify(allScheduleData.flat())
        );
      } catch (error) {
        console.error("Error fetching schedule data:", error);
      }
    } else {
      const teamId = allTeam.find((team) => team.name === selectedTeam)?.id;
      if (teamId) {
        const scheduleURL = `https://api.sportmonks.com/v3/football/schedules/teams/${teamId}?api_token=${API_TOKEN}`;
        try {
          const response = await axios.get(scheduleURL);
          if (response.data && Array.isArray(response.data.data)) {
            const scheduleData = response.data.data;
            setScheduleData(scheduleData);
            setIsLoading(false);
            localStorage.setItem("scheduleData", JSON.stringify(scheduleData));
          } else {
            console.error("Invalid response data structure");
          }
        } catch (error) {
          console.error(
            `Error fetching schedule for team ${selectedTeam}:`,
            error
          );
        }
      }
    }
  };

  const Fixture = ({ fixture }) => {
    const { name, starting_at, participants } = fixture;

    const homeTeam = participants.find((team) => team.meta.location === "home");
    const awayTeam = participants.find((team) => team.meta.location === "away");

    return (
      <div>
        {/* arger than small screen*/}
        <div className="hidden sm:block min-w-full items-center p-1 bg-white border-b border-gray-300">
          <h2 className="bg-gray-200 border rounded-sm shadow-sm p-2 text-xl font-bold text-center mb-2">
            {name}
          </h2>
          <div className="flex flex-row bg-gray-100 border rounded-sm shadow-sm p-2 text-md font-semibold">
            <p className="w-1/4 p-2 text-center flex items-center">
              Date : {starting_at}
            </p>
            <div className="w-3/4 flex flex-row justify-around items-center">
              <img
                src={homeTeam ? homeTeam.image_path : ""}
                alt={homeTeam.name}
                className="w-12 h-12"
              />
              <p className="text-xl pr-0">{homeTeam.name}</p>
              <p className="text-2xl font-bold">vs</p>
              <p className="text-xl">{awayTeam.name}</p>
              <img
                src={awayTeam ? awayTeam.image_path : ""}
                alt={awayTeam.name}
                className="w-12 h-12"
              />
            </div>
          </div>
        </div>
        {/* small screen */}
        <div className="sm:hidden min-w-full m-2 rounded-2xl items-center p-1 bg-white border-b border-gray-300">
          <h2 className="bg-gray-200 border rounded-2xl shadow-2xl p-0 text-xl font-bold text-center mb-0">
            {name}
          </h2>
          <div className="flex flex-col items-center justify-center">
            <p className="p-0 text-center flex items-center">
              Date : {starting_at}
            </p>
            <div className="flex flex-row rounded-sm shadow-sm p-1 text-md font-semibold">
              <div className="max-w-full flex items-center justify-center w-full">
                <div className="flex items-center justify-evenly w-12">
                  <img
                    src={homeTeam ? homeTeam.image_path : ""}
                    alt={homeTeam.short_code || homeTeam.name}
                    className="w-12 h-12"
                  />
                </div>
                <div className="flex items-center justify-center w-10 mx-2">
                  <p className="text-base">
                    {homeTeam.short_code || homeTeam.name}
                  </p>
                </div>
                <div className="flex items-center justify-center w-10">
                  <p className="text-2xl font-bold">vs</p>
                </div>
                <div className="flex items-center justify-center w-10 mx-2">
                  <p className="text-base">
                    {awayTeam.short_code || awayTeam.name}
                  </p>
                </div>
                <div className="flex items-center justify-center w-12">
                  <img
                    src={awayTeam ? awayTeam.image_path : ""}
                    alt={awayTeam.short_code || awayTeam.name}
                    className="w-12 h-12"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Your Favorite Teams' Schedule
      </h1>
      <input
          type="text"
          placeholder="Search for a team"
          value={searchedTeam}
          onChange={(e) => setSearchedTeam(e.target.value)}
          className="p-2 border border-gray-300 rounded-md mr-2"
        />
        <button onClick={handleSearch} className="p-2 bg-blue-500 text-white rounded-md">
          Search
        </button>
      <select
        onChange={(e) => handleFilter(e.target.value)}
        value={selectedTeam}
        className="p-2 border border-gray-300 rounded-md mr-2"
      >
        <option value="">Select a Team</option>
        {allTeam
          .filter((yourFavoriteTeam) =>
            favoriteTeams.includes(yourFavoriteTeam.id)
          )
          .map((team) => (
            <option key={team.id} value={team.name}>
              {team.name}
            </option>
          ))}
      </select>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4">
          {scheduleData &&
            scheduleData.length > 0 &&
            scheduleData.map((scheduleItem, scheduleIndex) => (
              <div key={`schedule_${scheduleIndex}`}>
                {scheduleItem.rounds &&
                  scheduleItem.rounds.length > 0 &&
                  scheduleItem.rounds.map((round, roundIndex) => (
                    <div key={`round_${roundIndex}`}>
                      {round.fixtures &&
                        round.fixtures.length > 0 &&
                        round.fixtures.map((fixture, fixtureIndex) => (
                          <Fixture
                            key={`fixture_${fixtureIndex}`}
                            fixture={fixture}
                          />
                        ))}
                    </div>
                  ))}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Schedule;
