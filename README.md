# Spotify Playlist Backup
A google app script to backup Spotify playlists to Spreadsheet.

## Install
- Create Spreadsheet
  - `git clone`
  - `docker compose up -d` and enter docker container
  - `npm install` for local development
  - `clasp login`
  - `clasp create --title "Spotify Playlists"`
    - Select `sheets`
  - `clasp push`
- Create Spotify app and get Client ID and Secret
  - https://developer.spotify.com/dashboard/applications
- Set script properties 
  - Open created Spreadsheet and open App Script
  - Go to project settings
  - Set script properties
    - `client_id`
      - Spotify API Client ID
    - `client_secret`
      - Spotify API Secret
    - `playlist_ids`
      - Spotify playlist IDs (comma separated e.g.`aaaaaaaaaa,bbbbbbbbbb`)
- Run Script
