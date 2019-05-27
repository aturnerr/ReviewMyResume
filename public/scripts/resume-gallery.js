function filter_resumes() {
  // Declare variables
  var input, filter, resumes, td, td2, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.options[input.selectedIndex].value;
  resumes = document.getElementsByTagName("a");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < resumes.length; i++) {
    td = resumes[i].getElementsByClassName("tag1");
    td2 = resumes[i].getElementsByClassName("tag2");
    if (td) {
      txtValue = td[0].innerText;
      if (txtValue.indexOf(filter) > -1) {
        resumes[i].style.display = "";
      } else if (td2 && td2[0].innerText.indexOf(filter) > -1) {
        resumes[i].style.display = "";
      } else {
        resumes[i].style.display = "none";
      }
    } else {
      resumes[i].style.display = "none";
    }
  }
}
