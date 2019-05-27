// navbar shadow effect
$(function(){
    $(document).scroll(function(){
        var $nav = $("#mainNavBar");
        
        $nav.toggleClass("scrolled-nav", $(this).scrollTop() > 0);

    });
});
