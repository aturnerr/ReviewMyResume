$(document).ready(function(){

    $userTypeDropdown = $("#type");

    $userTypeDropdown.change(function(){
        if ($(this).val() == "reviewer") {
            $(".reviewer-info").css("display", "block");
            $("#occupation").prop("required", true);
            $("#company").prop("required", true);
        } else{
            $(".reviewer-info").css("display", "none");
            $("#occupation").prop("required", false);
            $("#company").prop("required", false);
        }
    });
})