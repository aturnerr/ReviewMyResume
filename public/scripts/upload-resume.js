$(document).ready(function(){ 
  
    $("select").change(function() {   
      $("select").not(this).find("option[value="+ $(this).val() + "]").attr('disabled', true);
    }); 
}); 

function showname () {
  var name = document.getElementById('file');
  var label = document.getElementById("file-input-label");
  label.innerText = name.files.item(0).name;
};