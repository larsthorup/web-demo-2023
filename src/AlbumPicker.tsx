import { useState, FormEvent } from "react";

export default function AlbumPicker() {
  const [albums, setAlbums] = useState<string[]>([]);
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // const target = e.target as typeof e.target & {
    //   artist: { value: string };
    // };
    // const artist = encodeURIComponent(target.artist.value);
    const form = e.target as HTMLFormElement;
    const formElements = form.elements as typeof form.elements & {
      artist: { value: string };
    };
    const artist = encodeURIComponent(formElements.artist.value);
    console.log({ artist, elements: form.elements });
    const url = `https://musicbrainz.org/ws/2/release?fmt=json&query=artist:${artist}`;
    const response = await fetch(url);
    const mbResult = (await response.json()) as {
      releases: { title: string }[];
    };
    const { releases } = mbResult;
    setAlbums(releases.map(({ title }) => title));
  }
  return (
    <form onSubmit={handleSubmit} name="search" aria-label="search">
      <label>
        Artist name:
        <input name="artist" />
      </label>
      <button type="submit">Search</button>
      <p>Albums:</p>
      <ol>
        {albums.map((album) => (
          <li>{album}</li>
        ))}
      </ol>
    </form>
  );
}
