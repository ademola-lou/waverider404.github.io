  
var app = document.getElementById('chatMessage');

var typewriter = new Typewriter(app, {
    loop: false,
    cursor: "🤖",
    delay: .2
});

typewriter.pauseFor(2500)
    .typeString('Hello there! My name is ronnie')
    .pauseFor(2500)
    .deleteAll()
    .typeString('I am an interactive ai-bot in progress')
    .pauseFor(2500)
    .deleteAll()
    .typeString('you can click on me to see me jump')
    .pauseFor(3200)
    .deleteAll()
    .typeString('you can also drag to rotate')
    .start();

  function displayIframeA(){
    location.replace('./Games/zombieRunner.html')
  }
console.clear()