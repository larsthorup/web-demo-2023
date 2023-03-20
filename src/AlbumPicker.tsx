import { useState, FormEvent } from "react";

export default function AlbumPicker() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [albums, setAlbums] = useState<string[]>([]);
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formElements = form.elements as typeof form.elements & {
      artist: HTMLInputElement;
      date: HTMLInputElement;
    };
    if (
      formElements.artist.value === "lars" &&
      formElements.date.value === "1966"
    ) {
      formElements.artist.setCustomValidity("Lars was born in 1966");
      return;
    }
    const artist = encodeURIComponent(formElements.artist.value);
    const date = encodeURIComponent(formElements.date.value);
    const query = `artist:${artist} AND date:${date}`;
    const url = `https://musicbrainz.org/ws/2/release?fmt=json&query=${query}`;
    setLoading(true);
    try {
      const response = await fetch(url);
      const mbResult = (await response.json()) as {
        releases: { title: string; date: string }[];
      };
      const { releases } = mbResult;
      setAlbums(releases.map(({ title, date }) => `${title} (${date})`));
      const logResponse = await fetch(
        "https://eoy1vosu2h8dew3.m.pipedream.net",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url,
            count: releases.length,
          }),
        }
      );
      if (!logResponse.ok) {
        setError("Could not log search");
      }
    } finally {
      setLoading(false);
    }
  }
  function onValidate(e: FormEvent) {
    const target = e.target as HTMLInputElement;
    if (target.validity.badInput || target.validity.rangeUnderflow) {
      target.setCustomValidity("Please enter a year after 1950");
    } else {
      target.setCustomValidity("");
    }
  }
  return (
    <form onSubmit={handleSubmit} name="search" aria-label="search">
      <label>
        Artist name:
        <input name="artist" autoFocus={true} />
      </label>
      <br />
      <label htmlFor="date">Release date:</label>
      <input
        id="date"
        name="date"
        type="number"
        min={1950}
        onInput={onValidate}
      />
      <button type="submit">Search</button>
      {error && <p>{error}</p>}
      {loading && <p>Loading...</p>}
      {!loading && (
        <>
          <p>Albums:</p>
          <ol>
            {albums.map((album, index) => (
              <li key={index}>{album}</li>
            ))}
          </ol>
        </>
      )}
    </form>
  );
}
