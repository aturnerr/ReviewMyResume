$(document).ready(function(){

    $("select").change(function() {
      $("select").not(this).find("option[value="+ $(this).val() + "]").attr('disabled', true);
    });
});
