# TweetMap-Scalable

This is a scalable version of <a href="https://github.com/vigneshgawali/TweetMap">TweetMap</a> web application. This application uses Twitter Streaming API to get tweets with geolocation to plot the tweets on a map along with the sentiment of the tweet.  
This application uses:
- Google Map API: for plotting the tweets on a map
- Elastic Search: for efficient searching of tweets based on keywords stored in JSON format on AWS ElasticSearch Service
- MonkeyLearn Sentiment Analysis API: for calculating the sentiment of the tweet text
- Amazon SQS: A queueing service to store the streamed tweets making them available for consumption
- Amazon SNS: A notification service that notifies the subscriber of new available tweets.

Application Architecture:
![Alt text](/../screenshots/arch.JPG?raw=true "Application Architecture")

Web Application Screenshot:
![Alt text](/../screenshots/appscreen.JPG?raw=true "Screenshot")


This application is created using Python Django framework and hosted on AWS BeanStalk.

Steps to run the application:

- Download the project
- Change Twitter, AWS, and MonkeyLearn API Keys in config.ini file.
- Run manage.py file --> python manage.py runserver
- To stream new tweets run TwitterStreamer.py and SentimentAnalyzer.py
- Access the application in browser --> http://localhost:8000
