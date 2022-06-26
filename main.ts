import URLFetchRequestOptions = GoogleAppsScript.URL_Fetch.URLFetchRequestOptions;

function main() {
    const scriptProperties = PropertiesService.getScriptProperties();
    const clientId = scriptProperties.getProperty('client_id');
    const clientSecret = scriptProperties.getProperty('client_secret');
    const playlistIds = scriptProperties.getProperty('playlist_ids')!.split(',');
    const accessToken = getAccessToken(clientId, clientSecret);
    for (const playlistId of playlistIds) {
        backupPlaylist(accessToken, playlistId);
    }
}

function getAccessToken(clientId: string | null, clientSecret: string | null) {
    const base64Str = Utilities.base64Encode(`${clientId}:${clientSecret}`, Utilities.Charset.UTF_8);
    const options: URLFetchRequestOptions = {
        method: 'post',
        headers: {
            'Authorization': `Basic ${base64Str}`
        },
        payload: {
            'grant_type': 'client_credentials'
        },
    }
    const response = UrlFetchApp.fetch('https://accounts.spotify.com/api/token', options);
    const content = JSON.parse(response.getContentText());
    return content.access_token;
}

function backupPlaylist(accessToken: string, playlistId: string) {
    const url = `https://api.spotify.com/v1/playlists/${playlistId}`;
    const playlistData = getPlaylistData(accessToken, url);
    console.log(playlistData.name);
    processTracks(accessToken, playlistData.tracks);
}

function getPlaylistData(accessToken: string, url: string) {
    const options: URLFetchRequestOptions = {
        method: 'get',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    }
    const response = UrlFetchApp.fetch(url, options);
    return JSON.parse(response.getContentText());
}

function processTracks(accessToken: string, tracks: any) {
    const items = tracks.items;
    for (const item of items) {
        console.log(`${item.track.artists[0].name} - ${item.track.name}`);
    }
    if (tracks.next) {
        const playlistData = getPlaylistData(accessToken, tracks.next);
        processTracks(accessToken, playlistData);
    }
}
