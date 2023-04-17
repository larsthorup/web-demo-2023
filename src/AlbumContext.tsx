import { createContext, useContext, useReducer } from "react";

// Type of state
type AlbumState = {
  results: string[];
  artist: string;
  date: string;
};

// Initial state
const initialAlbumState = {
  results: [],
  artist: "",
  date: "",
};

// Type of actions
type AlbumAction = { type: "search"; payload: AlbumState } | { type: "reset" };

// Reducer
const albumReducer = (state: AlbumState, action: AlbumAction) => {
  switch (action.type) {
    case "search":
      return action.payload;
    case "reset":
      return initialAlbumState;
  }
};

// State context
const AlbumContext = createContext<AlbumState | null>(null);

// Dispatch context
const AlbumDispatchContext = createContext<React.Dispatch<AlbumAction> | null>(
  null
);

// Provider
type AlbumProviderProps = React.PropsWithChildren<{ albumState?: AlbumState }>;
export function AlbumProvider({
  children,
  albumState: explicitAlbumState,
}: AlbumProviderProps) {
  const [albumState, albumDispatch] = useReducer(
    albumReducer,
    explicitAlbumState || initialAlbumState
  );
  return (
    <AlbumContext.Provider value={albumState}>
      <AlbumDispatchContext.Provider value={albumDispatch}>
        {children}
      </AlbumDispatchContext.Provider>
    </AlbumContext.Provider>
  );
}

// state hook
export function useAlbumState() {
  const albumState = useContext(AlbumContext);
  if (albumState === null) {
    throw new Error("Unexpected useAlbumState without parent <AlbumProvider>");
  }
  return albumState;
}

// dispatch hook
export function useAlbumDispatch() {
  const dispatch = useContext(AlbumDispatchContext);
  if (dispatch === null) {
    throw new Error(
      "Unexpected useAlbumDispatch without parent <AlbumProvider>"
    );
  }
  return dispatch;
}
