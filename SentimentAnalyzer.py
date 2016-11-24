#-----------------------------------------------------------------------------
# Get Sentiment of Tweets
# This code gets the tweets from SQS queue and performs a sentiment analysis
# using MonkeyLearn API. Once the sentiment is calculated, a notification is
# sent to the subscribers using AWS SNS.
#-----------------------------------------------------------------------------

import json
import time
import boto3
from monkeylearn import MonkeyLearn
from configparser import ConfigParser

#Read keys from config file
secret = ConfigParser()
secret.read("config.ini")

#AWS Authentication and Initialization - SQS
sqs = boto3.resource(
    'sqs',
    aws_access_key_id = secret['AWS']['access_key'],
    aws_secret_access_key = secret['AWS']['access_key_secret'],
)
queue = sqs.get_queue_by_name(QueueName='TweetQueue')

#AWS Authentication and Initialization - SNS
sns = boto3.resource(
    'sns',
    aws_access_key_id = secret['AWS']['access_key'],
    aws_secret_access_key = secret['AWS']['access_key_secret'],
)

topic = sns.Topic('SNS TOPIC ARN')

#MonkeyLearn Authentication
ml = MonkeyLearn(secret['MONKEYLEARN']['access_key'])

#Get sentiment of tweet text using MonkeyLearn Service
def getSentiment(tweetText):
    sentences = [ tweetText ]
    sentimentResult = ml.classifiers.classify(secret['MONKEYLEARN']['module_id'], sentences, sandbox=True).result
    for result in sentimentResult:
        sentiment = result[0]['label']
        return sentiment

def main():
    print("Sentiment Analysis Begin!!")
    while True:
        messages = queue.receive_messages()
        if len(messages) == 0:
            print("Currently no tweets in queue. Taking a nap!")
            time.sleep(10)

        else:
            print("Publishing %d messages from queue" %len(messages))
            for message in messages:
                tweet = json.loads(message.body)
                text = tweet["text"]
                sentiment = getSentiment(text)
                tweet["sentiment"] = sentiment

                #Call SNS Publish
                response = topic.publish(
                    Message=json.dumps(tweet),
                    MessageAttributes={
                    }
                )

                #Delete message from queue once processed.
                message.delete()

if __name__ == '__main__':
    main()