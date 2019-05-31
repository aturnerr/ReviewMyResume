
if (typeof(String.prototype.trim) === "undefined"){
    String.prototype.trim = function(){
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

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

  // limit to 3 resumes
  var count = 0;
  $(".resume").each(function(){
      if ($(this).css("display") === "flex"){
        count += 1;
        if (count > 3){
            $(this).css("display", "none");
        }
      }
  });
}

$(document).ready(function() {
  filter_resumes();
});

