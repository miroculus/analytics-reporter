const google = require('googleapis')
const SLACK_URL = process.env.SLACK_URL
const request = require('request')
const client_email = process.env.CLIENT_EMAIL
const private_key = process.env.PRIVATE_KEY.replace(/\\n/g, '\n')

let sites = process.env.SITES
let jwtClient = new google.auth.JWT(
  client_email,
  null,
  private_key,
  ['https://www.googleapis.com/auth/analytics.readonly'],
  null);

function queryData(analytics, ViewId, next, callback) {
  analytics.data.ga.get({
    'auth': jwtClient,
    'ids': ViewId,
    'start-date': '2daysAgo',
    'end-date': '1daysAgo',
    'metrics': 'ga:uniquePageviews,ga:newUsers,ga:sessionDuration,ga:users',
    'max-results': 25
  }, function (err, response) {
    if (err) {
      callback(err);
      return;
    }
    callback(null, response, next);
  });
}

function generateReport(ViewId, callback){
  jwtClient.authorize(function (err, tokens) {
    if (err) return callback(err);

    queryData(google.analytics('v3'), ViewId, callback, function(err, message, callback){
      if (err) return callback(err)

      let options = {
        url: SLACK_URL,
        method: 'POST',
        form: 'payload={"channel": "#reports", "username": "Google Analytics", "text": "*Yesterday pageviews for:* ' + message.profileInfo['profileName'] + '\n ' + '_Page Views:_ ' + message.totalsForAllResults['ga:uniquePageviews'] + '\n _New Users:_ ' + message.totalsForAllResults['ga:newUsers'] + '\n _Returning Users:_ ' + (message.totalsForAllResults['ga:uniquePageviews'] - message.totalsForAllResults['ga:newUsers']) + '\n _Session Duration:_ ' + message.totalsForAllResults['ga:sessionDuration'] + '\n _Users:_ ' + message.totalsForAllResults['ga:users'] + '", "icon_emoji": ":analytics:", "color": "green"}'
      }

      return request(options, callback)
    });
  });
}

exports.handler = (event, context, callback) => {
  sites.split(',').forEach(function(value){
    generateReport(value, function(err, response, body){
      if (!err && response.statusCode == 200) console.log(value + ' Message sent to Slack...')
      if (!err && response.statusCode != 200) console.log(value + ' Response !200:', body)

      if (err) console.log(value + ' Error: ', err)

      console.log(value + ' Operation completed')
    })
  })
}
