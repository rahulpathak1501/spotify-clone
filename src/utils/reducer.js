import { reducerConstants } from "./Constants";

export const initialState = {
  token: null,
  playlists: [],
  userData: {},
  selectedPlaylistId: "37i9dQZF1DX5KpP2LN299J",
  selectedPlaylist: null,
  currentlyPlaying: null,
  playerState: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case reducerConstants.SET_TOKEN: {
      return {
        ...state,
        token: action.token,
      };
    }
    case reducerConstants.SET_PLAYLISTS: {
      return {
        ...state,
        playlists: action.playlists,
      };
    }

    case reducerConstants.SET_USER: {
      return {
        ...state,
        userData: action.userData,
      };
    }

    case reducerConstants.SET_PLAYLIST: {
      return {
        ...state,
        selectedPlaylist: action.selectedPlayList,
      };
    }

    case reducerConstants.SET_PLAYING: {
      return {
        ...state,
        currentlyPlaying: action.currentlyPlaying,
      };
    }
    case reducerConstants.SET_PLAYERSTATE: {
      return {
        ...state,
        playerState: action.playerState,
      };
    }
    case reducerConstants.SET_PLAYLISTS_ID: {
      return {
        ...state,
        selectedPlaylistId: action.selectedPlaylistId,
      };
    }

    default:
      return state;
  }
};

export default reducer;
