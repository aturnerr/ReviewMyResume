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

    $('select[name="user[type]"]').change(function(){
      if ($(this).val() == "student"){
          // document.body.style.backgroundPosition= "0% 100%";
          document.body.classList.remove("to-purple");
          document.body.classList.add("to-blue");
          // alert("call the do something function on option 2");
      }
        if ($(this).val() == "reviewer"){
            // document.body.style.backgroundPosition= "0% 100%";
            document.body.classList.remove("to-blue");
            document.body.classList.add("to-purple");
            // alert("call the do something function on option 2");
        }
    })

})
