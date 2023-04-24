import { useEffect, useState } from "react";
import { AlbumProvider } from "./AlbumContext";
import AlbumPicker from "./AlbumPicker";
import "./App.css";
import { Login, initializeDescope } from "./Login";

const descope = initializeDescope();

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
  const imageUrl = `https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Key_%28music%29_icon.svg/64px-Key_%28music%29_icon.svg.png`;
  const href = "https://musicbrainz.org/";
  // const href = 'javascript:prompt("Please enter your password")'; // URL injection example
  // if (href.startsWith('javascript')) throw new Error("")
  return (
    <AlbumProvider>
      <div className="App">
        <a href={href}>
          <img src={imageUrl} />
        </a>
        <h1>Web Demo</h1>
        <a onClick={(ev) => navigate(ev, "count")}>Count</a> |{" "}
        <a onClick={(ev) => navigate(ev, "album")}>Album search</a> |{" "}
        <a onClick={(ev) => navigate(ev, "login")}>Login</a>
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
        {page === "login" && descope && (
          <div className={pageClasses}>
            <Login descope={descope} />
          </div>
        )}
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </AlbumProvider>
  );
}

export default App;
