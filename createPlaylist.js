require('dotenv').config();
const querystring = require('querystring');
const axios = require('axios');

const createPlaylist = function() {

  // step 1: Log into youtube
  // const get_youtube_client() {

  // }

  // step 2: Grab your liked videos
  // const get_liked_videos() {

  // }

  // step 3: Create a new playlist in Spotify
  const create_playlist = function() {

    const queryParams = querystring.stringify({
      name: 'Youtube Liked Videos',
      description: 'All Liked Youtube Videos',
      public: true
    })

    let query = `https://api.spotify.com/v1/users/${process.env.USER_ID}/playlists?${queryParams}`
    axios.post(query, {
      headers: {
      Authorization: `Bearer BQC_HXL8my8EHtCD7AD9x8L__62gsVwLKil8Tjpvv3D5lUA_Id7N67ApSdv8Cz6avHxJmzAH1nEUesmAvQkR4c8AlJvApUh5_N8L6I_qFrcglesYFMLuZnoeJRUX6Jr1cXkeDpmexOE3SA6i7hkHxA1Pfxsqbxszsf7QQwEjr7EQ2mNU9j4YHg3Ev_tDIJSypn7DpmP3ppJsQPob`,
      'Content-Type': 'application/json'
    }})
    .then((response) => {
      console.log(response.data);
    })
  }

  // create_playlist();

  const viewUser = function() {
    axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer BQC_HXL8my8EHtCD7AD9x8L__62gsVwLKil8Tjpvv3D5lUA_Id7N67ApSdv8Cz6avHxJmzAH1nEUesmAvQkR4c8AlJvApUh5_N8L6I_qFrcglesYFMLuZnoeJRUX6Jr1cXkeDpmexOE3SA6i7hkHxA1Pfxsqbxszsf7QQwEjr7EQ2mNU9j4YHg3Ev_tDIJSypn7DpmP3ppJsQPob`
      }
    })
    .then((response) => {
      console.log(response.data);
    })
  }

  viewUser();

  // step 4: search for the song in Spotify
  // const get_spotify_url() {

  // }

  // step 5: Add this song into the new Spotify playlist
  // const add_song_to_playlist() {

  // }
 };

 createPlaylist();