// show deletion confirmation modal when a notifications delete button
// is clicked
$(".notif-exit-btn").on("click", function(){
    var id = $(this).attr('id');
    $("#" + id + "Modal").modal("show");
});

// shows the help modal, giving the user a description of the pages usage
$(document).ready(function() {
    $("#helpModal").modal('show');
});