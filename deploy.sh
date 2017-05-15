########## Daily Report

# Create ZIP file
zip -r deploy.zip . -x *.git*

# Upload to AWS Lambda & Run
aws lambda update-function-code --function-name myAnalyticsDailyReport --zip-file fileb://deploy.zip --region us-west-2

# To excec after a deploy
# aws lambda invoke --function-name myAnalyticsDailyReport output.txt --region us-west-2

# Remove ZIP file
rm deploy.zip
