$(document).ready(function () {

  var tweetResults;
  var tweetURL = "https://rcb-api.herokuapp.com/twitter-search/";
  var watsonUrl = "https://rcb-api.herokuapp.com/watson";
  var unsplashUrl = "https://api.unsplash.com/photos/random?client_id=f34feb729b3f4dcb2170102dfa3191bcd6765d61a6a1ac4e291d3f9a338ee4cc"

  function getTweets(searchTerm) {

    var queryURL = tweetURL + searchTerm;
    console.log(queryURL);

    $.ajax({
      url: queryURL,
      method: "GET"
    }).done(function(response) {
      $("#tweets").empty();
      console.log(response);

      if(response.statuses.length === 0) {
        $("#tweet-term").html("Sorry, there are no tweets.");
      } else {
        $("#tweet-term").html(searchTerm);
      }

      for (var i = 0; i < response.statuses.length; i++) {
        if (response.statuses[i].lang = "en") {
          var newDiv1 = $("<div>");
          newDiv1.addClass("card tweet");

          var newDiv2 = $("<div>");
          newDiv2.addClass("card-body");

          var cardTitle = $("<h4>");
          cardTitle.addClass("card-title");
          cardTitle.text(response.statuses[i].user.screen_name);

          newDiv2.append(cardTitle);

          var cardSubtitle = $("<h6>");
          cardSubtitle.addClass("card-subtitle mb-2 text-muted");
          cardSubtitle.text(moment(response.statuses[i].created_at).format("dddd, MMMM Do YYYY, h:mm:ss a"));
          newDiv2.append(cardSubtitle);

          var cardText = $("<p>");
          cardText.addClass("card-text");
          cardText.text(response.statuses[i].text);
          newDiv2.append(cardText);

          var tonalyze = $("<button>");
          tonalyze.addClass("btn btn-block btn-outline-dark analyze");
          tonalyze.text("Tonalyze It!");

          newDiv2.append(tonalyze);

          newDiv1.append(newDiv2);

          $("#tweets").append(newDiv1);
        }
      } 
    })

  }

  function changeBg() {

    $.ajax({
      url: unsplashUrl,
      method: "GET"
    }).done(function(response){
      console.log(response);
      $(".heading").css({"backgroundImage" : "url(" + response.urls.full + ")"})
      $(".heading").attr("data-title", response.user.id);
    })


  };

  $("#background-change").on("click", changeBg);
  
  $("#search").on("click", function(event) {
    event.preventDefault();
    console.log("search button has been clicked");
    var searchTerm = $("#searchTerms").val();
    console.log(searchTerm);
    $("#searchTerms").val("");
    getTweets(searchTerm)
  });


  $(document).on("click", ".analyze", function () {

    // WHAT DO YOU THINK IS HAPPENING HERE?
    // When the button is clicked, among the other elements that also belong to newDiv2, as defined above, the one by the class 'card-text' is selected and its text content is used as a definition of the new variable 'tweetContent".'
    console.log(this)
    $(this).prop("disabled", true);
    var tweetContent = $(this).siblings(".card-text").text();

    // AND HERE?
    // When a button is clicked, the upper div where the button belongs to is used as a definition of the new variable 'tweetCard'.
    var tweetCard = $(this).parent();
    console.log(tweetCard);

    // WE HAVEN'T DONE THIS YET, SO TRY AND LEARN IT AND BE AHEAD OF EVERYONE ELSE! 
    // Pass object into GET request
    var requestObj = {
      tweetContent: tweetContent,
    }

    // Using "data" this time to pass information
    $.ajax({
      url: watsonUrl,
      method: "GET",
      data: requestObj
    }).done(function (response) {
      // 1) CONSOLE.LOG() RETURNED DATA SO YOU KNOW WHAT YOU'RE WORKING WITH
      console.log(response);

      var tone = response.document_tone.tone_categories[0].tones;
      console.log(tone);

      var list = $("<ul>")
      list.addClass("list-group list-group-flush");

      for (i = 0; i < tone.length; i++) {
        var toneScore = tone[i].score * 100;
        var toneName = tone[i].tone_name;
        list.append("<li class='list-group-item'>" + toneName + " : " + toneScore);
      }

      tweetCard.append(list);
    })
  })

  // END Click Event()

  // =======================================================


  // set bg on load
  changeBg();
  // init search
  getTweets("javascript");

})