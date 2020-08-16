function showabout(){
    $("#about_container").css("display","inherit");
    $("#about_container").addClass("animated slideInLeft");
    setTimeout(function(){
        $("#about_container").removeClass("animated slideInLeft");
    },800);
  parent.location.hash = "about_container";
}
function closeabout(){
    $("#about_container").addClass("animated slideOutLeft");
    setTimeout(function(){
        $("#about_container").removeClass("animated slideOutLeft");
        $("#about_container").css("display","none");
    },800);
  parent.location.hash = "home";
}

function loadbookmark(){
  
  var str = document.location.href;
  var bookmark = str.replace("https://regal-free-weight.glitch.me/#", "");

  if(document.location.href.includes(bookmark)){
    try{
    document.getElementById(bookmark).style.display = "inherit"
    }catch(err){
      console.log("%cWelcome to my website", "color:blue; font-size: 30px;")
    }
  }
}
function closepage(id){
   $(id).addClass("animated slideOutLeft");
    setTimeout(function(){
        $(id).removeClass("animated slideOutLeft");
        $(id).css("display","none");
    },800);
  parent.location.hash = "home";
}
function showwork(){
    $("#work_container").css("display","inherit");
    $("#work_container").addClass("animated slideInRight");
    setTimeout(function(){
        $("#work_container").removeClass("animated slideInRight");
    },800);
   parent.location.hash = "work_container";
}

function showtutorial(){
    $("#tutorial_container").css("display","inherit");
    $("#tutorial_container").addClass("animated slideInRight");
    setTimeout(function(){
        $("#tutorial_container").removeClass("animated slideInRight");
    },800);
  parent.location.hash = "tutorial_container";
}
function closetutorial(){
    $("#tutorial_container").addClass("animated slideOutRight");
    setTimeout(function(){
        $("#tutorial_container").removeClass("animated slideOutRight");
        $("#tutorial_container").css("display","none");
    },800);
  parent.location.hash = "home";
}

function showtutorial2(){
    $("#tutorial2_container").css("display","inherit");
    $("#tutorial2_container").addClass("animated slideInRight");
    setTimeout(function(){
        $("#tutorial2_container").removeClass("animated slideInRight");
    },800);
  parent.location.hash = "tutorial2_container";
}
function closetutorial2(){
    $("#tutorial2_container").addClass("animated slideOutRight");
    setTimeout(function(){
        $("#tutorial2_container").removeClass("animated slideOutRight");
        $("#tutorial2_container").css("display","none");
    },800);
  parent.location.hash = "home";
}

function closework(){
    $("#work_container").addClass("animated slideOutRight");
    setTimeout(function(){
        $("#work_container").removeClass("animated slideOutRight");
        $("#work_container").css("display","none");
    },800);
  parent.location.hash = "home";
}
function showcontact(){
    $("#contact_container").css("display","inherit");
    $("#contact_container").addClass("animated slideInUp");
    setTimeout(function(){
        $("#contact_container").removeClass("animated slideInUp");
    },800);
  parent.location.hash = "contact_container";
}
function closecontact(){
    $("#contact_container").addClass("animated slideOutDown");
    setTimeout(function(){
        $("#contact_container").removeClass("animated slideOutDown");
        $("#contact_container").css("display","none");
    },800);
  parent.location.hash = "home";
}
function openTutorial(id){
    $(id).css("display","inherit");
    $(id).addClass("animated slideInUp");
    setTimeout(function(){
    $(id).removeClass("animated slideInUp");
    },800);
}

//https://regal-free-weight.glitch.me/#work_container
 // console.log(document.location.href)
 

function embedvideo(id, videoId){
   var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          height: '390',
          width: '640',
          videoId: videoId,
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }

      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        event.target.playVideo();
      }
      var done = false;
      function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
          setTimeout(stopVideo, 6000);
          done = true;
        }
      }
      function stopVideo() {
        player.stopVideo();
      }
}
setTimeout(function(){
    $("#loading").addClass("animated fadeOut");
    setTimeout(function(){
      $("#loading").removeClass("animated fadeOut");
      $("#loading").css("display","none");
      $("#box").css("display","none");
      $("#about").removeClass("animated fadeIn");
      $("#contact").removeClass("animated fadeIn");
      $("#work").removeClass("animated fadeIn");
    },1000);
loadbookmark()
},1500);
