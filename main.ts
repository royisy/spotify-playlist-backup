import URLFetchRequestOptions = GoogleAppsScript.URL_Fetch.URLFetchRequestOptions;

function main() {
    const accessToken = getAccessToken();
    console.log(accessToken);
}

function getAccessToken() {
    const scriptProperties = PropertiesService.getScriptProperties();
    const clientId = scriptProperties.getProperty('client_id');
    const clientSecret = scriptProperties.getProperty('client_secret');

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
