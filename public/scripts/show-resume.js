
$(".r-star.unlocked").hover(function(){
    var id = $(this).attr("id");
    var n = parseInt(id.charAt(id.length-1));
    var stars = $(".r-star.unlocked");

    // determine current user's rating based on the right most star that they
    // hover over
    stars.each(function(){
        var id_ = $(this).attr("id");
        var n_ = parseInt(id_.charAt(id_.length-1));
        if (n_ <= n) {
            $(this).removeClass("far");
            $(this).addClass("fas");
        } else{
            $(this).removeClass("fas");
            $(this).addClass("far");
        }
    });

    $("#rating").val(n+1);

    var locked_stars = $(".r-star.locked");
    locked_stars.each(function(){
        var id_ = $(this).attr("id");
        var n_ = parseInt(id_.charAt(id_.length-1));
        if (n_ <= n) {
            $(this).removeClass("far");
            $(this).addClass("fas");
        } else{
            $(this).removeClass("fas");
            $(this).addClass("far");
        }
    })
});

// show resume deletion confirmation modal
$(".del-btn").on("click", ()=>{
    $("#delModalCenter").modal("show");
});

// show resume review request confirmation modal
$(".review-btn").on("click", ()=>{
    $("#reviewCenter").modal("show");
});

// show the help modal, giving the user a description of the pages usage
$(document).ready(function() {
    $("#helpModal").modal('show');
});