# AutomateSpotify

## Overview
This application has a simple frontend and powerful backend that enables users to seamlessly import their YouTube playlists to their Spotify accounts. The application streamlines the process of adding songs from YouTube to Spotify by eliminating the need for manual song-by-song addition. The main objective of this application is to enhance the organization of music across both platforms
 
 ## Table of Contents
- [Installation](#installation-and-setup)
- [Understanding OAuth 2.0](#understanding-oauth-20)
- [Technologies](#technologies)
 
 ## Installation and Setup
 1. Fork and clone the repo and navigate to the root directory.
 2. Fill out "XXX" in the .env file with the information from .env_example 
 3. You will need to obtain an Oauth token from the Spotify API website - see Understanding OAuth 2.0
 4. Open http://localhost:8888/login in your browser
      - this endpoint will allow you to retrieve your Spotify access token. 
      - No additional code needs to be added on your part, the token will be internally used to allow you to make request to Spotify's API to create playlist and etc. 
      - see Understanding OAuth 2.0 for more information on how this works
5. Open http://localhost:8888 in your browser to start using the application 
6. YouTube playlist IDs are embedded in the URL after "list=" 
     - for example: https://www.youtube.com/watch?v=4POUDVKNXVI&list=PLfrDcxKz69SSGmNuAdL_Lfyilx_pgSb11
     - the YouTube playlist ID is: PLfrDcxKz69SSGmNuAdL_Lfyilx_pgSb11
![Screen_Recording_2023-02-16_at_9_54_47_PM_AdobeExpress](https://user-images.githubusercontent.com/82681370/219569419-88978c51-3c19-4b53-a396-11144f702243.gif)


 ## Understanding OAuth 2.0 
 - Spotify Documentation to understanding the Authorization Code Flow - https://developer.spotify.com/documentation/general/guides/authorization/code-flow/#:~:text=Request

Authorization Code Flow (Summarized) 
 1. The app (developer using this application) will need to make request to the user(you) to give permission to their spotify account 
 2. The user (you) will allow your app to use your Spotify account for the app
 3. The app will tell Spotify that they were granted permission 
 4. Spotify will double check with the user to confirm that the user has given permission to the app 
 5. Once confirmed, Spotify will provide the app with an authorization code
 6. Using the authorization code, the app can request for an access token to use Spotify's API 
     - (Note: authorization code and access token are different)
  
 ![Screen Shot 2022-06-12 at 2 55 00 PM](https://user-images.githubusercontent.com/82681370/219564138-1523d5c4-25a5-49c7-86a5-5714afab90b3.png)


## Technologies
- HTML
- Javascript
- Third Party APIs:
  - Youtube API - get Youtube information
  - Spotify API - Create Spotify playlist, Search for Song URIs, Add Songs to Spotify (to playlist created)
