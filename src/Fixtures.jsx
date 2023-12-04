import React, { useEffect, useState } from "react";
import axios from "axios";

const PROXY_URL = "http://localhost:8080/";
const API_TOKEN =
  "BujBVYCXEixHZf3TNhNX4enX530mgdG0f1aV2OZn1JoRgdRuQfMJyM3GcHFh";
const ALLTEAM_URL = `https://api.sportmonks.com/v3/football/teams?api_token=${API_TOKEN}`;

function FootballFixtures({ favoriteTeams }) {
  const [fixturesData, setFixturesData] = useState(
    JSON.parse(localStorage.getItem("fixturesData")) || []
  );
  const [allTeam, setAllTeam] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredTeam, setFilteredTeam] = useState("");
  const [originalFixturesData, setOriginalFixturesData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [teamFixtureYears, setTeamFixtureYears] = useState([]);
  const years = Array.from({ length: 24 }, (_, index) => 2000 + index);

  

  const updateTeamFixtureYears = (data) => {
    if (filteredTeam === "") {
      const years = [
        ...new Set(
          data.map((fixture) => new Date(fixture.starting_at).getFullYear())
        ),
      ];
      setTeamFixtureYears(years);
    }
  };

  const handleYearFilter = async (selectedYear) => {
    setSelectedYear(selectedYear);
    if (selectedYear === "") {
      resetFixturesData();
    } else {
      const promises = favoriteTeams.map(async (teamId) => {
        const startDate = `${selectedYear}-01-01`;
        const endDate = `${selectedYear}-12-31`;
        try {
          const fixturesURL = `https://api.sportmonks.com/v3/football/fixtures/between/${startDate}/${endDate}/${teamId}?api_token=${API_TOKEN}&include=scores.participant&order=desc`;
          const response = await axios.get(fixturesURL);
          if (response.data && Array.isArray(response.data.data)) {
            return response.data.data;
          } else {
            console.error("Invalid response data structure");
            return [];
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          return [];
        }
      });

      try {
        const fixturesDataArray = await Promise.all(promises);
        const filteredData = fixturesDataArray.flat();
        setFixturesData(filteredData);
        setOriginalFixturesData(filteredData);
        updateFixturesData(filteredData);
      } catch (error) {
        console.error("Error fetching data for multiple teams:", error);
      }
    }
  };

  const updateFixturesData = (data) => {
    const sortedData = sortFixturesByDate(data);
    setFixturesData(sortedData);
    updateTeamFixtureYears(sortedData);
  };

  const sortFixturesByDate = (data) => {
    return data.sort(
      (a, b) => new Date(b.starting_at) - new Date(a.starting_at)
    );
  };

  const saveDataToLocalStorage = (data) => {
    localStorage.setItem("fixturesData", JSON.stringify(data));
  };

  const getSavedDataFromLocalStorage = () => {
    const savedData = localStorage.getItem("fixturesData");
    return savedData ? JSON.parse(savedData) : [];
  };

  const resetFixturesData = () => {
    setFixturesData([...originalFixturesData]);
  };

  useEffect(() => {
    if (originalFixturesData.length > 0 && filteredTeam !== "") {
      updateTeamFixtureYears(originalFixturesData);
    }
  }, [originalFixturesData, filteredTeam]);

  useEffect(() => {
    const storedData = getSavedDataFromLocalStorage();
    if (storedData.length > 0) {
      setFixturesData(storedData);
      setOriginalFixturesData(storedData);
      updateFixturesData(storedData);
    }
  }, []);

  

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

  console.log("allTeam", allTeam);
  console.log("fixtureData", fixturesData);

  useEffect(() => {
    if (favoriteTeams.length > 0) {
      const favoriteTeamFixtures = [];
      for (const teamId of favoriteTeams) {
        const team = allTeam.find((t) => t.id === teamId);
        if (team) {
          const fixturesURL = `https://api.sportmonks.com/v3/football/fixtures/search/${team.name}?api_token=${API_TOKEN}&include=scores.participant&order=desc&per_page=50`;
          fetchFixturesData(fixturesURL, favoriteTeamFixtures);
        }
      }
    }
  }, [favoriteTeams, allTeam]);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredFixtures = originalFixturesData.filter((fixture) => {
      const homeTeamScore = fixture.scores.find(
        (score) =>
          score.score?.participant === "home" && score.description === "CURRENT"
      );
      const awayTeamScore = fixture.scores.find(
        (score) =>
          score.score?.participant === "away" && score.description === "CURRENT"
      );
      const homeTeamName = homeTeamScore
        ? homeTeamScore.participant.name.toLowerCase()
        : "";
      const awayTeamName = awayTeamScore
        ? awayTeamScore.participant.name.toLowerCase()
        : "";
      return (
        homeTeamName.includes(searchTerm) || awayTeamName.includes(searchTerm)
      );
    });
    setFixturesData(filteredFixtures);
  };

  const handleFilter = async (selectedTeam) => {
    setFilteredTeam(selectedTeam);
    if (selectedTeam === "Your Favorite Team(s)") {
      await handleYearFilter(selectedYear);
    } else {
      const teamId = allTeam.find((team) => team.name === selectedTeam)?.id;
      if (teamId) {
        const startDate = `${selectedYear}-01-01`;
        const endDate = `${selectedYear}-12-31`;

        try {
          const fixturesURL = `https://api.sportmonks.com/v3/football/fixtures/between/${startDate}/${endDate}/${teamId}?api_token=${API_TOKEN}&include=scores.participant&order=desc`;
          const response = await axios.get(fixturesURL);
          if (response.data && Array.isArray(response.data.data)) {
            const filteredData = response.data.data;
            setFixturesData(filteredData);
            setOriginalFixturesData(filteredData);
            updateFixturesData(filteredData);
          } else {
            console.error("Invalid response data structure");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    }
  };

  const fetchFixturesData = (url, favoriteTeamFixtures) => {
    axios
      .get(url)
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          favoriteTeamFixtures.push(...response.data.data);
          setFixturesData(favoriteTeamFixtures);
          setOriginalFixturesData(favoriteTeamFixtures);
          updateFixturesData(favoriteTeamFixtures);
        } else {
          console.error("Invalid response data structure");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const Fixture = ({ fixture }) => {
    const homeTeamScore =
      fixture.scores &&
      fixture.scores.find(
        (score) =>
          score.score?.participant === "home" && score.description === "CURRENT"
      );
    const awayTeamScore =
      fixture.scores &&
      fixture.scores.find(
        (score) =>
          score.score?.participant === "away" && score.description === "CURRENT"
      );
    const homeTeamName = homeTeamScore
      ? homeTeamScore.participant.short_code
      : "Home Team";
    const awayTeamName = awayTeamScore
      ? awayTeamScore.participant.short_code
      : "Away Team";

    // Check if both home and away team scores are available before rendering
    if (!homeTeamScore || !awayTeamScore) {
      return null;
    }

    return (
      <div>
        {/* larger than small screen */}
        <div className="hidden sm:block min-w-full items-center p-1 bg-white border-b border-gray-300">
          <h2 className="bg-gray-200 border rounded-sm shadow-sm p-2 text-xl font-bold text-center mb-2">
            {fixture.name}
          </h2>
          <div className="flex flex-row bg-gray-100 border rounded-sm shadow-sm p-2 text-md font-semibold">
            <p className="w-1/4 p-2 text-center flex items-center">
              Date : {fixture.starting_at}
            </p>
            <div className="w-3/4 flex flex-row justify-around items-center">
              <img
                src={homeTeamScore ? homeTeamScore.participant.image_path : ""}
                alt={homeTeamName}
                className="w-12 h-12"
              />
              <p className="text-xl pr-0">{homeTeamName}</p>
              <p className="text-xl">{homeTeamScore.score.goals}</p>
              <p className="text-2xl font-bold">vs</p>
              <p className="text-xl">{awayTeamScore.score.goals}</p>
              <p className="text-xl">{awayTeamName}</p>
              <img
                src={awayTeamScore ? awayTeamScore.participant.image_path : ""}
                alt={awayTeamName}
                className="w-12 h-12"
              />
            </div>
          </div>
        </div>

        {/* //small screen */}
        <div className="sm:hidden min-w-full items-center p-0 bg-white border-b border-gray-300">
          <h2 className="bg-gray-200 border rounded-sm shadow-sm p-2 text-xl font-bold text-center mb-2">
            {fixture.name}
          </h2>
          <div className="flex flex-col items-center justify-center">
            <p className="p-2 text-center flex items-center">
              Date : {fixture.starting_at}
            </p>
            <div className="flex flex-row rounded-sm shadow-sm p-0 text-md font-semibold">
              <div className="max-w-full flex items-center justify-center w-full">
                <div className="flex items-center justify-center w-12">
                  <img
                    src={
                      homeTeamScore ? homeTeamScore.participant.image_path : ""
                    }
                    alt={homeTeamName}
                    className="w-12 h-12"
                  />
                </div>
                <div className="flex items-center justify-center w-10 mx-2">
                  <p className="text-xl">{homeTeamName}</p>
                </div>
                <div className="flex items-center justify-center w-10">
                  <p className="text-xl">{homeTeamScore.score.goals}</p>
                </div>
                <div className="flex items-center justify-center w-10">
                  <p className="text-2xl font-bold">vs</p>
                </div>
                <div className="flex items-center justify-center w-10">
                  <p className="text-xl">{awayTeamScore.score.goals}</p>
                </div>
                <div className="flex items-center justify-center w-10 mx-2">
                  <p className="text-xl">{awayTeamName}</p>
                </div>
                <div className="flex items-center justify-center w-12">
                  <img
                    src={
                      awayTeamScore ? awayTeamScore.participant.image_path : ""
                    }
                    alt={awayTeamName}
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
      <h1 className="text-3xl font-bold mb-4 text-center">Football Fixtures</h1>
      <input
        type="text"
        placeholder="Search team..."
        onChange={handleSearch}
        className="p-2 border border-gray-300 rounded-md"
      />
      <select
        onChange={(e) => handleFilter(e.target.value)}
        value={filteredTeam}
        className="p-2 border border-gray-300 rounded-md mr-2"
      >
        <option value="">Your Favorite Team(s)</option>
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
      <select
        onChange={(e) => handleYearFilter(e.target.value)}
        value={selectedYear}
        className="p-2 border border-gray-300 rounded-md"
      >
        <option value="">Select Year</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4">
          {fixturesData.map((fixture, index) => (
            <Fixture key={`${fixture.id}_${index}`} fixture={fixture} />
          ))}
        </div>
      )}
    </div>
  );
}

export default FootballFixtures;
