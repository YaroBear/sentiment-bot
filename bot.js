var Twit = require('twit');

var config = require('./config');
var afinn= require('./AFINN.json');

var T = new Twit(config);

function trendiest(callback){
	T.get('trends/place', {id: 1}, function(err, data, response){
	var highestTrend = 0;
	var hashTag = "";
	for (var i = 0; i < data[0]["trends"].length; i++)
	{
		if (data[0]["trends"][i]["tweet_volume"] > highestTrend)
		{
			highestTrend = data[0]["trends"][i]["tweet_volume"];
			hashTag = data[0]["trends"][i]["name"];
		}
	}
	callback(hashTag);
	})
}

function retrieveTweets(hashtag, count, callback){
	var tweetsArray = [];
	T.get('search/tweets', {q: "%23" + hashtag, count: count}, function(err, data, response){
		for (var i = 0; i < count; i++){
			if (typeof data["statuses"][i] !== 'undefined'){
				tweetsArray.push(data["statuses"][i]["text"]);
			}
		}
		callback(tweetsArray);
	})
}

function getAvgSentiment(tweets)
{
	var sentimentValue = 0;
	tweets.forEach(function(tweet){
		var wordArray = tweet.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(" ");
		wordArray.forEach(function(word){
			if (typeof afinn[word] !== 'undefined'){
				sentimentValue += afinn[word];
			}
		});
	});
	return sentimentValue;
}

function postTweet(status){
	T.post('statuses/update', {status : status }, function(err, data, response){
		console.log(err);
	});
}

//fix callback-ception

var stats = {};
trendiest(function(hashTag){
	stats.hashTag = hashTag;
	retrieveTweets(hashTag, 100, function(tweets){
		stats.numberAnalyzed = tweets.length;
		stats.sentimentValue = getAvgSentiment(tweets);
		console.log(stats);

		status = "The trendiest hashtag is currently " + stats.hashTag
		+ ". The last " + stats.numberAnalyzed + " tweets have a sentiment value of " +
		stats.sentimentValue;
		postTweet(status);
	});
});



