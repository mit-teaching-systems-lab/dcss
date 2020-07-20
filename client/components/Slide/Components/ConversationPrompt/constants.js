// SEE:
//
// - https://github.com/CookPete/react-player#config-prop
// - https://developers.google.com/youtube/player_parameters
//
//
export const YOUTUBE_PLAYER_EDITOR_VARS = {
  playerVars: {
    autoplay: 0,
    cc_load_policy: 1,
    controls: 1,
    fs: 0,
    modestbranding: 1,
    origin: location.origin,
    playsinline: 1,
    rel: 0,
    showinfo: 1
  }
};

export const YOUTUBE_PLAYER_DISPLAY_VARS = {
  playerVars: {
    cc_load_policy: 1,
    controls: 0,
    fs: 0,
    modestbranding: 1,
    origin: location.origin,
    playsinline: 1,
    rel: 0,
    showinfo: 1
  }
};
