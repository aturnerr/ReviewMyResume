if(typeof(String.prototype.trim) === "undefined")
{
    String.prototype.trim = function()
    {
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
}

$(document).ready(function() {
  filter_resumes();
});

