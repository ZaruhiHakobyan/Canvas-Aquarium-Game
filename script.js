(function() {

  var $canvas = $('#canvas');
  var canvas = $canvas[0];
  var context = canvas.getContext("2d");

  var points = 0;

  function getRandomColor() {
      var letters = '0123456789ABCDEF'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++ ) {
          color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
  }

  function createFish() {

    var size = 30 + Math.random() * 100;

    return  {
      x: (Math.random() * (canvas.width-200)) + 100,
      y: (Math.random() * (canvas.height-200)) + 100,
      height: size,
      width: size,
      color: getRandomColor(),
      xVelocity: (size-15)/100,
      yVelocity: (size-15)/100,
      src: 'images/fish'+ (Math.floor(Math.random() * 5) + 1),
      reverseImg: 1,
      dead: false
    };
  }

  function createFishes(n){
    var fishes = [];
    for(var i = 0; i < n; i++){
        fishes.push(createFish())
    }
    return fishes.sort(function(a, b) {
      if(a.height > b.height)
        return 1;
      if(a.height < b.height)
        return -1;
      return 0;
    });
  }

  var fishes = createFishes(15);

  var imgStore = {};
  var getImg = function(url) {
      var img = imgStore[url];
      if(!img) {
        img = new Image();
        img.src = url;
        imgStore[url] = img;
      }
      return img;
  };

  var background = new Image();
  //background.src = "https://crossorigin.me/http://spacee.xyz/aqua/background.jpg";
  background.src = "images/background.jpg";

  function draw() {
      context.drawImage(background, 0, 0, canvas.width, canvas.height);
      context.beginPath();

      for(var i = 0; i < fishes.length; i++) {
          var el = fishes[i];

          var height = el.height;
          if(!el.dead){
            el.x += el.xVelocity;
            el.y += el.yVelocity;

            if(el.x <= 10 || el.x + el.width >= canvas.width){
                el.xVelocity *= -1;
                el.reverseImg *= -1;
            }
            if(el.y <= 50 || el.y + el.height >= canvas.height){
                el.yVelocity *= -1;
            }

            var fishImg = getImg(el.src + el.reverseImg + '.png');
            if(!fishImg)
              alert('wtf: '+el.src + el.reverseImg + '.png')
            context.drawImage(fishImg, el.x, el.y, el.width, el.height);

          } else{
            el.height = el.width - el.width/3;
            if(el.y < canvas.height-el.height){
                el.y += 2;
            }else{
                el.y = canvas.height-el.height;
            }

            var fishImg = getImg('dead/' + el.src + el.reverseImg + '.png');
            if(!fishImg)
              alert('wtf: '+'dead/' + el.src + el.reverseImg + '.png')
            context.drawImage(fishImg, el.x, el.y, el.width, el.height);
          }
      }
    }

    var eventQueue = [];
    var processEvents = function() {
      for(var i = 0; i < eventQueue.length; i++)
          (eventQueue.pop())();
    }

    var loop = function() {
      processEvents();
      draw();
      window.requestAnimationFrame(loop);
    };
    loop();

    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', 'shotSound.mp3');


    canvas.onmousedown = function(e) {
        eventQueue.push(function() {
          for(var i = 0; i < fishes.length; i++) {
              var fish = fishes[i];
              if(fish.dead)
                  continue;

              if( (e.clientX > fish.x)
                  && (e.clientX < fish.x + fish.width)
                  && (e.clientY > fish.y) 
                  && (e.clientY < fish.y + fish.height)){
                  if(fish.height < 70){
                    points += 100;
                  }else if (fish.height < 110) {
                    points += 50;
                  }else{
                    points += 20;
                  }
                  fish.dead = true;
                }
            }

            audioElement.currentTime = 0;
            audioElement.play();
            $('#points').text(points);
        });
    };

    $('#addFish').click(function(){
        fishes.push(createFish());
    });

    $(document).ready(function(){
        $('#points').text(points);
    });

})();
