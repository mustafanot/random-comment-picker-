var snip = [];var ukc;
var item = {};
var img;
function pgRst() {
  location.reload();
}
var isNull
Array.prototype.isNull = function (){
    return this.join().replace(/,/g,'').length === 0;
};
var keys = ['AIzaSyB3uWEBG75shuDQg8YnpNBHiaN69NWs6H4','AIzaSyDRzNYiqnsG9PAL1aB2i2XT-uthFpnl778'];
var key = function(){ return keys[Math.floor(Math.random()*keys.length)]; }
$(document).ready(function(){
  var queries = {};
  if(location.search){
    $.each(document.location.search.substr(1).split('&'),function(c,q){
     var i = q.split('=');
     queries[i[0].toString()] = i[1].toString();
    });
  }
  if(queries.v){
    var qray = queries.v.split('');
    if(qray.length < 11 || qray.length > 11) {
       Materialize.toast('Oops! Invalid URL, Please Try Again...', 4000);
    } else {
      var url = "https://youtube.com/watch?v=" + queries.v;
      $('#dm-yturl').val(url);
      Materialize.toast('URL Loaded Succesfully, Please Proceed.', 4000);
    }
  }
    $("form").submit(function(evt){
            evt.preventDefault();
            if(!snip.length <= 0) {
              snip = [];
              window.location.reload(false);
             }
        $('#random').attr("disabled", true).val("Loading....");
        var videoUrl = $('input').val();
        var videoId = videoUrl.match(/^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/)[1];
        var imgApi = `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoId}&key=${key()}`;
        function imgCall(data){
          if(data.items === undefined || data.items.length == 0) {
            Materialize.toast('The Video Provided is Invalid, Please Try Another Video.', 4000);
          } else {
            $('#random').removeClass('none');
            $('#VidThumb').removeClass('none');
            $('#CommentLoading').removeClass('none');
            Materialize.toast('Loading Comments...', 3000, 'rounded white black-text');
            var item = data.items[0];
            var ez = data.items[0].snippet;
            var imgg = ez.thumbnails;
            var title = ez.title;
            var url = 'https://www.youtube.com/watch?v='+ data.items[0].id;
            var views = numeral(item.statistics.viewCount);
            var likes = numeral(item.statistics.likeCount);
            var dislike = numeral(item.statistics.dislikeCount);
            var comment = numeral(item.statistics.commentCount);
            if(imgg.maxres) {
               img = imgg.maxres.url;
          } else {
               if(imgg.standard) {
                   img = imgg.standard.url;
               } else {
                   if(imgg.high) {
                     img = imgg.high.url;
                   } else {
                       img = imgg.medium.url;
                   }
               }
          }
            $('#likes').html(likes.format());
            $('#dislikes').html(dislike.format());
            $('#comments').html(comment.format());
            $('#views').html(views.format());
            $('#img').attr('src', img);
            $('#title').html(title);
            $('#url').attr('href', url);
            }
        }
        $.getJSON(imgApi, imgCall);
        var api = 'https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=' + videoId + '&maxResults=100&key=' + key();
        function call(data){
            if(data.items === undefined || data.items.length == 0) {
                Materialize.toast('The Video Provided is Invalid, Please Try Another Video.', 4000);
            }
            else {
            $.each(data.items, function(i, item){
                var did = item.snippet.topLevelComment.snippet;
                snip.push(did);
            });
            if(data.nextPageToken){
                api = "https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=" + videoId + "&maxResults=100&key=" + key() + "&pageToken=" + data.nextPageToken;
                $.getJSON(api, call);
            }
            if(!data.nextPageToken){
                      $('#random').attr("disabled", false).val("Pick Your Winner.");
                      Materialize.toast('Comments Loaded!', 3000, 'rounded white black-text');
                      $('#CommentLoading').fadeOut(200, function() {
                        $(this).addClass('none');
                      });
                      $('#CommentLoaded').delay(300).fadeIn(100, function() {
                        $(this).removeClass('none');
                      });
            }
            snip = _.map(_.groupBy(snip,function(comment){
                return comment.authorChannelUrl;
            }),function(grouped){
                return grouped[0];
            });
            ukc = snip.length;
            $('#ukcomment').html(ukc);
        }}
        $.getJSON(api, call);
    });

    $('#random').click(function(evt){
        evt.preventDefault();
        $('#CommentLoaded').fadeOut(100, function() {
          $(this).addClass('none');
        });
        $('#RandomComment').delay(200).fadeIn(200, function() {
          $(this).removeClass('none');
        });
        item = snip[Math.floor(Math.random()*snip.length)];
        $('#winName').html(item.authorDisplayName);
        $('#winComment').html(item.textDisplay);
        $('#winUrl').attr('href', item.authorChannelUrl);
        var imgUrls = item.authorProfileImageUrl + '?size=100';
        $('#winImg').attr('src', imgUrls);
});


    $('#best').click(function(evt){
    	var best = 0;
		for (var i = snip.length - 1; i >= 0; i--) {
	    	if (snip[i].likeCount > snip[best].likeCount) {
	    		best = i;
	    	}
	    }
	    snip_best = snip[best];


        evt.preventDefault();
        $('#CommentLoaded').fadeOut(100, function() {
          $(this).addClass('none');
        });
		 $('#RandomComment').fadeOut(100, function() {
	          $(this).addClass('none');
        });
        $('#bestComment').delay(200).fadeIn(200, function() {
          $(this).removeClass('none');
        });
        $('#bestwinName').html(snip_best.authorDisplayName);
        $('#bestwinComment').html(snip_best.textDisplay);
        $('#bestwinUrl').attr('href', snip_best.authorChannelUrl);
        var imgUrls = snip_best.authorProfileImageUrl + '?size=100';
        $('#bestwinImg').attr('src', imgUrls);
});






    });



