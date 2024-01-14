import "semantic-ui-css/semantic.min.css";
import "./App.css";

import { useMemo, useState } from "react";

import PlayerSelection from "./components/player-selection";
import Dashboard from "./components/dashboard";
import { MONOPOLY_STORAGE_KEY } from "./constants/globals";

function App() {
  const dataFromSessionStorage = useMemo(
    () => window.localStorage.getItem(MONOPOLY_STORAGE_KEY),
    []
  );
  const [data, setData] = useState(null);

  const hasData = data || dataFromSessionStorage;

  return (
    <div className="app-board">
      {hasData ? (
        <Dashboard initData={data} sessionData={dataFromSessionStorage} />
      ) : (
        <PlayerSelection onSubmit={setData} />
      )}
    </div>
  );
}

export default App;
