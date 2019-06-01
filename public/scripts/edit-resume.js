// ensure that both drop downs don't have the same tags on them
$(document).ready(function(){
    $("select").change(function() {
      $("select").not(this).find("option[value="+ $(this).val() + "]").attr('disabled', true);
    });
});
