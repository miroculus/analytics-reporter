const google = require('googleapis')
const SLACK_URL = '**REMOVED**' //process.env.SLACK_URL
const request = require('request')

let key = require('**REMOVED**')

let jwtClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ['https://www.googleapis.com/auth/analytics.readonly'],
  null);

function queryData(analytics, ViewId, next, callback) {
  analytics.data.ga.get({
    'auth': jwtClient,
    'ids': ViewId,
    'start-date': 'yesterday',
    'end-date': 'today',
    'metrics': 'ga:uniquePageviews',
    'max-results': 25
  }, function (err, response) {
    if (err) {
      callback(err);
      return;
    }
    callback(null, response, next);
  });
}

function generateReport(ViewId, target, callback){
  jwtClient.authorize(function (err, tokens) {
    if (err) return callback(err);

    queryData(google.analytics('v3'), ViewId, callback, function(err, message, callback){
      if (err) return callback(err)

      let options = {
        url: SLACK_URL,
        method: 'POST',
        form: 'payload={"channel": "#reports", "username": "Google Analytics", "text": "Yesterday pageviews for ' + target + ': ' + message.totalsForAllResults['ga:uniquePageviews'] + '", "icon_emoji": ":analytics:"}'
      }

      // Start the request
      return request(options, callback)
    });
  });
}

generateReport('**REMOVED**', '**REMOVED**', function(err, response, body){
    if (!err && response.statusCode == 200) console.log('[**REMOVED**] Message sent to Slack...')
    if (!err && response.statusCode != 200) console.log('[**REMOVED**] Response !200:', body)

    if (err) console.log('[**REMOVED**] Error: ', err)

    console.log('**REMOVED**] Operation completed')

    generateReport('**REMOVED**', '**REMOVED**', function(err, response, body){
        if (!err && response.statusCode == 200) console.log('[**REMOVED**] Message sent to Slack...')
        if (!err && response.statusCode != 200) console.log('[**REMOVED**] Response !200:', body)

        if (err) console.log('[**REMOVED**] Error: ', err)

        console.log('[**REMOVED**] Operation completed')
    })
})
