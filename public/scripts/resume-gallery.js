// redefine trim function to remove all spaces from either side of string
if(typeof(String.prototype.trim) === "undefined"){
    String.prototype.trim = function(){
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

// ensures that only resumes with tags matching the filter value are visible
// on the gallery
function filter_resumes(){

  val = $("#myInput").val();
  $(".resume").each(function(){
    var tag1 = $(this).find(".tag-1 p").text();
    var tag2 = $(this).find(".tag-2 p").text();

    if (val !== "All" && !(tag1.trim() === val || tag2.trim() === val)){
      $(this).css("display", "none");
    } else{
      $(this).css("display", "flex");
    }
  });
}

// filter resumes as soon as the page loads
$(document).ready(function() {
  filter_resumes();
});

