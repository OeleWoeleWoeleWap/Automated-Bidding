function run(){
    var client = AdWordsApp.currentAccount().getName();
	for (var i = 0; i < lKeywds.length; i++) {
	
		var campaignItterator = AdWordsApp
     	 .campaigns()
     	 .withCondition("Name = '"+lKeywds[i].campaign+"'")
    	 .get()
    	if(!campaignItterator.hasNext()){
    		Logger.log('Campaign '+lKeywds[i].campaign+' bestaat niet')
    		continue;
    	}

        var campaign = campaignItterator.next();
    	var adgroupItterator = campaign.adGroups()
    	 .withCondition("Name = '"+lKeywds[i].adgroup+"'")
    	 .get();

    	if(!adgroupItterator.hasNext()){
    		Logger.log('Adgroup '+lKeywds[i].adgroup+' bestaat niet')
    		continue;
    	}

        var adgroup = adgroupItterator.next();

    	var keywordItterator = adgroup.keywords()
    	 .withCondition("Text ='"+lKeywds[i].keywd+"'")
         .withCondition("KeywordMatchType = "+lKeywds[i].matchtype)
    	 .get();

    	if(!keywordItterator.hasNext()){
    		Logger.log('Keyword '+lKeywds[i].keywd+' bestaat niet')
    		continue;
    	}

    	var keyword = keywordItterator.next();
        if(lKeywds[i].matchtype == 'BROAD')     var keytext = keyword.getText();
        if(lKeywds[i].matchtype == 'EXACT')     var keytext = '[' + keyword.getText() + ']';
        if(lKeywds[i].matchtype == 'PHRASE')    var keytext = '"' + keyword.getText() + '"';
        else                                    var keytext = keyword.getText();

        var qs = keyword.getQualityScore();

        // j stores how many weeks back
        for(var j=0;j<numweeks;++j){
            // get start and end date of the week.
            var period = getPeriod(j);
            var stats = keyword.getStatsFor(period[0],period[1]);

            //var avgCpc          = stats.getAverageCpc();
            //var avgPageviews    = stats.getAveragePageviews();
            var avgPos          = stats.getAveragePosition();
            //var avgTOS          = stats.getAverageTimeOnSite();
            //var bouncerate      = stats.getBounceRate();
            //var convRate        = stats.getClickConversionRate();
            //var ctr             = stats.getCtr();
            
            var impressies  = stats.getImpressions();
            var clicks      = stats.getClicks();
            var conversies  = stats.getConvertedClicks();
            var cost        = stats.getCost(); 

            var sumpos      = avgPos * impressies;

            var sUrl = "http://hera.clickvalue.nl/ontwikkel/adwords_scripts/automated_bidding/store_data.php?";
            sUrl += 'weekstart='+period[0].day+'-'+period[0].month+'-'+period[0].year; 
            sUrl += '&weekend='+period[1].day+'-'+period[1].month+'-'+period[1].year; 
            sUrl += '&client='+client; 
            sUrl += '&campaign='+campaign.getName(); 
            sUrl += '&adgroup='+adgroup.getName(); 
            sUrl += '&keyword='+keytext;
            sUrl += '&qs='+qs; 
            sUrl += '&impressions='+impressies;
            sUrl += '&clicks='+clicks; 
            sUrl += '&conversions='+conversies; 
            sUrl += '&cost='+cost; 

            sUrl += '&sumpos='+sumpos; 

            save(sUrl);            
        }
    	
	};

}

function getPeriod(weeksback){
    var d = new Date();

    // a week always starts on the same day, regardless of when the script is run.
    d -= (d.getDay() + weeksback * 7) * 1000 * 60 * 60 * 24;

    var week1 = new Date(d - 7 * 1000 * 60 * 60 * 24);
    var week2 = new Date(d - 1000 * 60 * 60 * 24);

    var weekstart   =  {year:week1.getFullYear(),month:week1.getMonth()+1,day:week1.getDate()};
    var weekend     =  {year:week2.getFullYear(),month:week2.getMonth()+1,day:week2.getDate()};
    return [weekstart,weekend];
}

function save(surl){
  try{
    surl = surl.replace('+','%2B');
    var fetch = UrlFetchApp.fetch(encodeURI(surl));
  }catch(e){
    Logger.log(e.message)
    // to negate error: "to many urlfetch calls per timeunit"
    Utilities.sleep(5000);
    store(surl);
  }
}

run();