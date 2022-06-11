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

  const scope = 'playlist-modify-public'

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

app.get('/getSpotifyUser', (req, res) => {
  axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((response) => {
      const queryParams = querystring.stringify({
        name: 'Youtube Liked Videos',
        description: 'All Liked Youtube Videos',
        public: true
      })

      let query = `https://api.spotify.com/v1/users/${process.env.USER_ID}/playlists?${queryParams}`
      axios.post(query, {
        headers: {
        Authorization: `Bearer BQBQ1DbhtTFQYP6NXgHPwEDcDAM78P3W1AoxIDLOzRc3PmdEpzC0_s6nXzSHB5R8NEgl3bmeZD2_lUIQ9fLqdqV4Md2oCW7VrrsvEU7MWa6gcfqrDBrWJReruB7no1dnJTz4P_9kfm338VjupXy19ebdOVurwFsHCsbRazZOrxqmhJNy58pVla2EQss4ICy6MZnfaAJ3WIjXwZ-8PCNsPDuPYYIZOH7nra3khjo7-wk`,
        'Content-Type': 'application/json'
      }})

      console.log(response.data);
      return;
    })
    .catch(error => {
      console.log(error);
      return;
    })
} )

 app.listen(port, () => {
   console.log(`Express app listening at http://localhost:${port}
   `)
 });

