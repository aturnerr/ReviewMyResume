if (typeof(String.prototype.trim) === "undefined"){
    String.prototype.trim = function(){
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

function filter_resumes(){

  var val = $("#myInput").val();
  var count = 0;
  $(".resume").each(function(){
    var tag1 = $(this).find(".tag-1 p").text();
    var tag2 = $(this).find(".tag-2 p").text();

    if (val !== "All" && (!(tag1.trim() === val || tag2.trim() === val) || count === 3)){
      $(this).css("display", "none");
    } else{
      $(this).css("display", "flex");
      count += 1;
    }
  });
}

$(document).ready(function() {
  filter_resumes();
  $(".modal").modal('show');
});

