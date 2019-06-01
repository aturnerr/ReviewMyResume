$(".notif-exit-btn").on("click", function(){
    var id = $(this).attr('id');
    $("#" + id + "Modal").modal("show");
});

$(document).ready(function() {
    $("#helpModal").modal('show');
});