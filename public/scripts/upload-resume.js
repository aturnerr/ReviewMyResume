// ensure that both drop downs don't have the same tags on them
$(document).ready(function(){
    $("select").change(function() {
      $("select").not(this).find("option[value="+ $(this).val() + "]").attr('disabled', true);
    });
});

// places the name of the file that's going to be uploaded in the input field
function showname () {
  var name = document.getElementById('file');
  var label = document.getElementById("file-input-label");
  label.innerText = name.files.item(0).name;
};

$(document).ready(function() {
  $(".modal").modal('show');
});