/**
 Step 1: Log into Youtube
 Step 2: Grab our Liked Videos
 Step 3: Create a new playlist
 Step 4: Search for the Song
 Step 5: Add this song into the new spotify playlist
 **/

 var express = require('express');
 const app = express();
 const port = 8888;
 require('dotenv').config();
 const querystring = require('querystring');
 const axios = require('axios');
 let token;
 let spotify_playlist_id;
 let song_uri;


 const CLIENT_ID = process.env.CLIENT_ID;
 const CLIENT_SECRET = process.env.CLIENT_SECRET;
 const REDIRECT_URI = process.env.REDIRECT_URI;

 console.log(CLIENT_ID);

 const generateRandomString = length => {
   let text = '';
   const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   for( let i = 0; i < length; i++) {
     text += possible.charAt(Math.floor(Math.random() *possible.length));
   }

   return text;
 };

 const stateKey = 'spotify_auth_state'

 app.get('/login', (req,res) => {

  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  const scope = 'playlist-modify-public user-library-modify playlist-modify-private'

   const queryParams = querystring.stringify({
     client_id: CLIENT_ID,
     response_type: "code",
     redirect_uri: REDIRECT_URI,
     state: state,
     scope: scope
   })

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
})

app.get('/callback', (req, res) => {
  const code = req.query.code || null;
  console.log('code', code)

  let auth = {
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: querystring.stringify({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
    }
  }
  axios(auth)
  .then(response => {
    if(response.status === 200) {

      const { access_token, token_type } = response.data;

      const { refresh_token } = response.data;

      axios.get(`http://localhost:8888/refresh_token?refresh_token=${refresh_token}`)
        .then(response => {
          token = response.data.access_token;
          res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`)
        })
        .catch( error => {
          res.send(error);
        });
    } else {
      res.send(response);
    }
  })
  .catch(error => {
    res.send(error);
  });
})

app.get('/refresh_token', (req, res) => {
  const { refresh_token } = req.query;

  let auth = {
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
    }
  }
  axios(auth)
  .then(response => {
    res.send(response.data);
  })
  .catch(error=> {
    res.send(error);
  })
})

app.get('/makeSpotifyPlaylist', (req, res) => {

  let auth = {
    method: 'post',
    url: `https://api.spotify.com/v1/users/${process.env.USER_ID}/playlists`,
    data: ({
      name: 'Youtube Liked',
      description: 'All youtube liked songs :)',
      public: true
    }),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
  }}
  axios(auth)
  .then(response => {
    spotify_playlist_id = response.data.id
    console.log('response.data.id',response.data.id)
    res.send(response.data);
  })
  .catch(error => {
    console.log(error);
    return;
  })
})

app.get('/getSpotifyURI', (req, res) => {
  console.log('song name', req.query.song_name)
  console.log('artist', req.query.artist)
  let song_name = req.query.song_name;
  let artist = req.query.artist;

  let auth = {
    method: 'get',
    url: `https://api.spotify.com/v1/search?q=artist%3D${artist}song%3D${song_name}&type=track`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
  }}
  axios(auth)
  .then(response => {

    console.log('uri',response.data.tracks.items[0].album.artists[0].uri)
    res.send(response.data);
  })
  .catch(error => {
    console.log(error);
    return;
  })
})




 app.listen(port, () => {
   console.log(`Express app listening at http://localhost:${port}
   `)
 });



// commands for the terminal

//  curl -X "POST" "https://api.spotify.com/v1/users/szedonna/playlists" --data "{\"name\":\"New Playlist\",\"description\":\"New playlist description\",\"public\":false}" -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer BQAdN5Qwx60JXRSJlicb9oXHBNXfqhWT5FAjXoUE3ECsvhdQQ3Gry7aBS6zAHKpLsNNHT4UMNBq8RkAFm3UiJ6zB10HZf-rQekY9kFX13uAlOyhCsoFiBeXjJ1j88nCpxBRt62uhlExnZO7rR_bayT-slar04XhInncdoM9lWOAM2B0O4C3nIIyiHqXs3ldW9X3KcGqvTA8XkhrGPOTETOcdOoMC6yDrIjGTtCORI-WeiBKItJ_wcSoa"