# Google Analytics Reporter

This tool will collect and create Daily reports about your Analytics Statistics and put them into [Slack](https://slack.com/)

The format should be like this

```
*Yesterday pageviews for:* <your website>
_Page Views:_ <page views>
_New Users:_ <new users>
_Returning Users:_ <returning users>
_Session Duration:_ <session duration>
_Users:_ <users>
```
## Instructions

This function could be set to be used as standalone, but the way we use it is by setting a [AWS Cloudwatch](https://aws.amazon.com/cloudwatch/), and a [AWS Lambda](https://aws.amazon.com/lambda/) function

Since this project uses `node_modules`, we have 2 ways of passing the code to [AWS Lambda](https://aws.amazon.com/lambda/)

- Uploading to [AWS S3](https://aws.amazon.com/s3/)
- Creating a ZIP file and uploading to Lambda (We usually use this, but could be changed)

## Installation

- Create a ZIP file
- Upload to [AWS Lambda](https://aws.amazon.com/lambda/)
- Set the [AWS Cloudwatch](https://aws.amazon.com/cloudwatch/) to call the function on the desired period of time
- You are all set

## Neccesary envars

Go to Google Analyticis and create a new project. In “APIs & auth → Credentials”, execute “Add credentials → Service account”. Download the resulting JSON file

`CLIENT_EMAIL`: Client email from the resulting file

`PRIVATE_KEY`: Private key from the resulting file

`SLACK_URL`: This is the Slack URL that will be used to make the post to. Format https://hooks.slack.com/services/<hash>/<hash>/<hash>
