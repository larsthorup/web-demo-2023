import { useState, FormEvent, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import AlbumPicker from "./AlbumPicker";

function App() {
  const [page, setPage] = useState("count");
  const [navigating, setNavigating] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    function popstateHandler() {
      const url = new URLSearchParams(window.location.search);
      const urlPage = url.get("page");
      console.log("popstate", { urlPage });
      setPage(urlPage || "count");
      setNavigating(true);
    }
    addEventListener("popstate", popstateHandler);
    popstateHandler();
    return () => {
      removeEventListener("popstate", popstateHandler);
    };
  }, []);
  useEffect(() => {
    setNavigating(false);
  }, [navigating]);
  function navigate(ev: React.MouseEvent<HTMLAnchorElement>, newPage: string) {
    ev.preventDefault();
    history.pushState({}, "", `?page=${newPage}`);
    dispatchEvent(new PopStateEvent("popstate"));
  }
  const pageClasses = `card ${navigating ? "navigating" : "navigated"}`;
  return (
    <div className="App">
      <h1>Web Demo</h1>
      <a onClick={(ev) => navigate(ev, "count")}>Count</a> |{" "}
      <a onClick={(ev) => navigate(ev, "album")}>Album search</a>
      <br />
      {page === "count" && (
        <div className={pageClasses}>
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
        </div>
      )}
      {page === "album" && (
        <div className={pageClasses}>
          <AlbumPicker />
        </div>
      )}
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
