import React, { useEffect } from "react";
import styled from "styled-components";
import { AiFillClockCircle } from "react-icons/ai";
import { useStateProvider } from "../utils/StateProvider";
import axios from "axios";
import { reducerConstants } from "../utils/Constants";

export default function Body({ headerBackground }) {
  const [{ token, selectedPlaylistId, selectedPlaylist }, dispatch] =
    useStateProvider();

  useEffect(() => {
    const intialPlayList = async () => {
      const response = await axios.get(
        `https://api.spotify.com/v1/playlists/${selectedPlaylistId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );

      const selectedPlayList = {
        id: response.data.id,
        name: response.data.name,
        description: response.data.description.startsWith(<a />)
          ? ""
          : response.data.description,

        img: response.data.images[0].url,
        tracks: response.data.tracks.items.map(({ track }) => ({
          id: track.id,
          name: track.name,
          artist: track.artists.map((artist) => artist.name),
          image:
            track.album.images.length > 0 ? track.album.images[2].url : null,
          duration: track.duration_ms,
          album: track.album.name,
          context_uri: track.album.uri,
          track_number: track.track_number,
        })),
      };
      // console.log(response.data.tracks);
      dispatch({ type: reducerConstants.SET_PLAYLIST, selectedPlayList });
    };
    intialPlayList();
  }, [token, dispatch, selectedPlaylistId]);

  const msToMinutesAndSecond = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };

  const playTrack = async (
    id,
    name,
    artist,
    image,
    context_uri,
    track_number
  ) => {
    const response = await axios.put(
      "https://api.spotify.com/v1/me/player/play",
      {
        context_uri,
        offset: { position: track_number - 1 },
        position_ms: 0,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 204) {
      const currentlyPlaying = {
        id,
        name,
        artist,
        image,
      };
      dispatch({ type: reducerConstants.SET_PLAYING, currentlyPlaying });
      dispatch({
        type: reducerConstants.SET_PLAYERSTATE,
        playerState: true,
      });
    } else {
      dispatch({
        type: reducerConstants.SET_PLAYERSTATE,
        playerState: false,
      });
    }
  };
  return (
    <Container headerBackground={headerBackground}>
      {/* {console.log(selectedPlaylist.name)} */}
      {selectedPlaylist && (
        <>
          <div className="playlist">
            <div className="image">
              <img src={selectedPlaylist.img} alt="playlist-image" />
            </div>

            <div className="details">
              <span className="type">PLAYLIST</span>
              <h1 className="title">{selectedPlaylist.name}</h1>
              <p className="description">{selectedPlaylist.description}</p>
            </div>
          </div>
          <div className="list">
            <div className="header-row">
              <div id="col">
                <span>#</span>
              </div>
              <div id="col">
                <span>Title</span>
              </div>
              <div id="col">
                <span>Album</span>
              </div>

              <div id="col">
                <span>
                  <AiFillClockCircle />
                </span>
              </div>
            </div>
            <div className="tracks">
              {selectedPlaylist.tracks.map(
                (
                  {
                    id,
                    name,
                    duration,
                    artist,
                    image,
                    album,
                    context_uri,
                    track_number,
                  },
                  index
                ) => {
                  return (
                    <div
                      className="row"
                      key={id}
                      onClick={() =>
                        playTrack(
                          id,
                          name,
                          artist,
                          image,
                          context_uri,
                          track_number
                        )
                      }
                    >
                      <div className="col">
                        <span>{index + 1}</span>
                      </div>
                      <div className="col detail">
                        <div className="image">
                          <img src={image} alt="track" />
                        </div>
                        <div className="info">
                          <span>{name}</span>
                          <span>{artist}</span>
                        </div>
                      </div>
                      <div className="col">
                        <span>{album} </span>
                      </div>
                      <div className="col">
                        <span>{msToMinutesAndSecond(duration)} </span>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </>
      )}
    </Container>
  );
}

const Container = styled.div`
  .playlist {
    margin: 0.2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    .image {
      img {
        height: 15rem;
        box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px 12px;
      }
    }
    .details {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      color: #e0dede;
      .title {
        color: white;
        font-size: 4rem;
      }
    }
  }
  .list {
    .header-row {
      display: grid;
      grid-template-columns: 0.3fr 3fr 2fr 0.1fr;
      color: #dddcdc;
      margin: 1rem 0 0 0;
      position: sticky;
      top: 15vh;
      padding: 1rem 3rem;
      transition: 0.3s ease-in-out;
      background-color: ${({ headerBackground }) =>
        headerBackground ? "#000000dc" : "none"};
    }
    .tracks {
      margin: 0 2rem;
      display: flex;
      flex-direction: column;
      margin-bottom: 5rem;
      cursor: pointer;
    }
    .row {
      padding: 0.5rem 1rem;
      display: grid;
      grid-template-columns: 0.3fr 3.1fr 1.85fr 0.1fr;
      &:hover {
        background-color: rgba(0, 0, 0, 0.7);
      }
    }
    .col {
      display: flex;
      align-items: center;
      color: #dddcdc;
      img {
        height: 40px;
      }
      .detail {
        display: flex;
        gap: 1rem;
      }
      .info {
        display: flex;
        flex-direction: column;
      }
    }
  }
`;
