// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    if(data.length == 0){
        $(".container").show();
    }
    else{
        $(".container").hide();
    }
    for (var i = 0; i < 10; i++) {
        // Display the apropos information on the page
        $("#articles").append(
            '<div class="jumbotron"> <a href="'+data[i].link+'><h1 class="display-4">'+ data[i].title +'</h1> </a><p class="lead">'+data[i].summary+'</p> <hr class="my-4"> <p class="lead"> <a class="btn btn-success btn-lg save" data-id="' + data[i]._id + '" role="button">Save Article</a> </p> </div>'
            //            "<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + data[i].summary + "</p>");
        )}
});

$(document).on("click",".scrape",function() {
    $.ajax({
        method: "GET",
        url: "/scrape"
    })
    console.log("scraped");
    location.reload();
})

$(document).on("click",".delete",function() {
    $.ajax({
        method: "GET",
        url: "/delete"
    })
    location.reload();
})


// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
    // With that done, add the note information to the page
        .then(function(data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<h2>" + data.title + "</h2>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

        // If there's a note in the article
        if (data.note) {
            // Place the title of the note in the title input
            $("#titleinput").val(data.note.title);
            // Place the body of the note in the body textarea
            $("#bodyinput").val(data.note.body);
        }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            // Value taken from title input
            title: $("#titleinput").val(),
            // Value taken from note textarea
            body: $("#bodyinput").val()
        }
    })
    // With that done
        .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
    });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});

$(document).on("click", ".save", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/savedArticles/" + thisId,
        data: {
            saved: true,
        }
    })
    // With that done
        .then(function(data) {
        // Log the response
        console.log(data);
    });

});
