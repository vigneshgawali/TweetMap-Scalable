#-----------------------------------------------------------------------------
# Stream Tweets from Twitter
# This code streams tweets and put them in a AWS SQS Queue.
#-----------------------------------------------------------------------------

import os
import json
import time
import boto3
import tweepy
import httplib2
from urllib.parse import urlparse
from configparser import ConfigParser
from TwittMap.settings import BASE_DIR  #Change to ProjectName.settings

#Read keys from config file
secret = ConfigParser()
secret.read("config.ini")

#Twitter Authentication and Initialization
twitter_auth = tweepy.OAuthHandler(secret['TWITTER']['consumer_key'], secret['TWITTER']['consumer_secret'])
twitter_auth.set_access_token(secret['TWITTER']['access_token'], secret['TWITTER']['access_token_secret'])

twitter_api = tweepy.API(twitter_auth, wait_on_rate_limit_notify=True, retry_count=3, retry_delay=5)

print("######### Twitter Authentication Success ######")

#AWS SQS Authentication and Initialization
#NOTE: Boto package uses aws credentials from ~./aws.config file.
sqs = boto3.resource(
    'sqs',
    aws_access_key_id = secret['AWS']['access_key'],
    aws_secret_access_key = secret['AWS']['access_key_secret'],
)
queue = sqs.get_queue_by_name(QueueName='TweetQueue')

#Check if the profile image url is valid. Done by sending a get request to the url. 
def checkURL(url):
    p = urlparse(url)
    conn = httplib2.HTTPSConnectionWithTimeout(p.netloc)
    conn.request('HEAD', p.path)
    resp = conn.getresponse()
    return resp.status != 404

#Twitter Stream Listener Implementation
class StreamListener(tweepy.StreamListener):
    count = 0
    def on_data(self, data):
        try:
            tweet = json.loads(data)
            if tweet['coordinates'] is not None:
                tweetText = tweet["text"]
                user_name = tweet["user"]["name"]
                screen_name = tweet["user"]["screen_name"]
                profile_pic = tweet["user"]["profile_image_url"].replace("normal", "bigger")
                link = "www.twitter.com/" + screen_name + "/status/" + str(tweet["id"])
                coordinates = tweet["coordinates"]["coordinates"]

                if checkURL(profile_pic) == False:
                    profile_pic = os.path.join(BASE_DIR, 'TwittMap/static/img/blank.jpg')
                    print(profile_pic)

                tweet_struct = {
                    "coordinates": [ coordinates[1], coordinates[0] ],
                    "username": user_name,
                    "screenname": screen_name,
                    "text": tweetText,
                    "profile_img": profile_pic,
                    "sentiment": "",
                    "id":tweet["id"],
                }
                print(tweet_struct)
                
                #Slow down the stream by sleeping for 10 seconds after every 10 tweets received
                self.count += 1
                if self.count == 10:
                    self.count = 0
                    print("Sleeping")
                    time.sleep(10)

                #Put tweet to SQS
                queue.send_message(MessageBody=json.dumps(tweet_struct))

        except (KeyError, UnicodeDecodeError, Exception) as e:
            pass

    def on_error(self, status_code):
        if status_code == 420:
            print ("Rate Limit")
            return True

def main():
    print("Twitter Stream Begin!!")
    stream_listener = StreamListener()
    while True:
        try:
            streamer = tweepy.Stream(twitter_api.auth,listener=stream_listener)
            streamer.filter(locations=[-180, -90, 180, 90], languages=['en'])
        except Exception as e:
            print (e)

if __name__ == '__main__':
    main()