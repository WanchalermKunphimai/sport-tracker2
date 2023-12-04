import React, { useState } from "react";

const SharedState = ({ children }) => {
  const [teams, setTeams] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState("");
  const [leagues, setLeagues] = useState([]);

  return children(teams, setTeams, selectedLeague, setSelectedLeague, leagues, setLeagues);
};

export default SharedState;