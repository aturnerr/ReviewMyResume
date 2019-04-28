$(document).ready(function(){

    $userTypeDropdown = $("#type");
    $countryDropdown = $("#country");

    $userTypeDropdown.change(function(){
        if ($(this).val() === "reviewer") {
            $(".reviewer-info").css("display", "block");
            $("#occupation").prop("required", true);
            $("#company").prop("required", true);
        } else{
            $(".reviewer-info").css("display", "none");
            $("#occupation").prop("required", false);
            $("#company").prop("required", false);
        }
    });

    $countryDropdown.change(function(){
        if ($(this).val() === "country"){
            $(this).css("color", "gray");
        } else{
            $(this).css("color", "black");
        }
    });
})
