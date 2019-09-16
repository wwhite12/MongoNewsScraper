$.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
      $("#articlesHere").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
  });
  
  
  $(document).on("click", "p", function() {
    $("#notesHere").empty();
    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      .then(function(data) {
        console.log(data);
        $("#notesHere").append("<h2>" + data.title + "</h2>");
        $("#notesHere").append("<input id='titleinput' name='title' >");
        $("#notesHere").append("<textarea id='bodyinput' name='body'></textarea>");
        $("#notesHere").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        if (data.note) {
          $("#titleinput").val(data.note.title);
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  $(document).on("click", "#savenote", function() {
    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        title: $("#titleinput").val(),
        body: $("#bodyinput").val()
      }
    })
      .then(function(data) {
        console.log(data);
        $("#notesHere").empty();
      });
  
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  