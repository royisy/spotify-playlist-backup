import Sheet = GoogleAppsScript.Spreadsheet.Sheet;
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
    const base64Str = Utilities.base64Encode(`${clientId}:${clientSecret}`);
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
    const playlistName = playlistData.name;
    Logger.log(`Backing up '${playlistName}'...`);
    const currentDate = Utilities.formatDate(new Date(), "JST", "yyyy/MM/dd");
    const newSheetName = `${playlistName} ${currentDate}`;
    const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (activeSpreadsheet.getSheetByName(newSheetName)) {
        Logger.log(`Sheet name '${newSheetName}' already exists.`);
        return;
    }
    const sheet = activeSpreadsheet.insertSheet(newSheetName);
    sheet.deleteRows(2, 999);
    sheet.deleteColumns(5, 21);
    sheet.setColumnWidths(1, 1, 50);
    sheet.setColumnWidths(2, 4, 200);
    const range = sheet.getRange(1, 1, 1, 5);
    range.setValues([['No', 'Artist Name', 'Track Name', 'Album Name', 'Track URI']]);
    processTracks(accessToken, playlistData.tracks, sheet);
    range.setFontWeight('bold');
    sheet.setFrozenRows(1);
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

function processTracks(accessToken: string, tracks: any, sheet: Sheet) {
    let lastRow = sheet.getLastRow();
    const items = tracks.items;
    const range = sheet.getRange(lastRow + 1, 1, items.length, 5);
    const values: string[][] = [];
    for (const item of items) {
        const row = [
            lastRow++,
            item.track.artists[0].name,
            item.track.name,
            item.track.album.name,
            item.track.uri,
        ];
        values.push(row);
    }
    range.setValues(values);
    if (tracks.next) {
        const playlistData = getPlaylistData(accessToken, tracks.next);
        processTracks(accessToken, playlistData, sheet);
    }
}
