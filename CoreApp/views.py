import json
import urllib3
from django.shortcuts import render
from django.http import HttpResponse
from configparser import ConfigParser
from requests_aws4auth import AWS4Auth
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET
from elasticsearch import Elasticsearch, RequestsHttpConnection


#Read keys from config file
secret = ConfigParser()
secret.read("config.ini")

#Setup AWS
AWSElasticPath = secret["AWS"]["elasticpath"]
AWSAccessKey = secret["AWS"]["access_key"]
AWSSecretKey = secret["AWS"]["access_key_secret"]
AWSRegion = secret["AWS"]["aws_region"]

awsAuthentication = AWS4Auth(AWSAccessKey, AWSSecretKey, AWSRegion, "es")

print("######### Authientication Success ######")

#Amazon Elastic Search initialization
elasticSearch = Elasticsearch(hosts = [{'host': AWSElasticPath, 'port': 443}],
    http_auth = awsAuthentication,
    use_ssl = True,
    verify_certs = True,
    connection_class = RequestsHttpConnection)

print("######### Elastic initialized ######")

def home(request):
    return render(request, "CoreApp/index.html");

def map(request):
    return render(request, "CoreApp/home.html")

#The SNS notifications have been configured to receive on localhost:8000/notifications url.
@csrf_exempt
def notifications(request):
    body = json.loads(request.body.decode("utf-8"))
    hdr = body['Type']

    #To confirm subscription of the service. Make a get request on the SubscribeURL url in the message.
    if hdr == 'SubscriptionConfirmation':
        url = body['SubscribeURL']
        print("Subscription Confirmation - Visiting URL : " + url)
        http = urllib3.PoolManager()
        r = http.request('GET', url)
        print(r.status)

    #Notification of a new message available.
    if hdr == 'Notification':
        print("SNS Notification")
        tweet = json.loads(body['Message'])
        #Add data to elastic search.
        elasticSearch.index(index='sentimentindex', doc_type='tweet', id=tweet["id"], body=tweet)

    return HttpResponse(status=200)

@require_GET
def keywordSelect(request):

    result_data = {
        "type": "FeatureCollection",
        "features": []
    }

    print("search query: " + str(request.GET['keyword']))
    searchKeyword = str(request.GET['keyword'])

    if searchKeyword is None or searchKeyword == '' or searchKeyword == 'All':
        elasticQuery = {
            'match_all':{}
        }
    else:
        elasticQuery = {
            "query_string": {
                "query": searchKeyword.lower()
            }
        }

    searchResult = elasticSearch.search(index="sentimentindex", body={
                                                                    "sort" :[ {"id" : {"order" : "desc"} }],
                                                                    "size": 3000,
                                                                    "query": elasticQuery
                                                                    })

    try:
        for entry in searchResult['hits']['hits']:
            result = entry['_source']
            if 'query' not in str(result):
                result_data['features'].append(result)

    except KeyError:
        print("No Results found")

    print(len(result_data['features']))
    return HttpResponse(json.dumps(result_data), content_type="application/json")


