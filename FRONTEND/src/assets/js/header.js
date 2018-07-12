$(document).ready(function(){
  $(window).scroll(function(){
	  if ($(window).scrollTop()>50) {
			$("nav").addClass('bg-dark');
			$("nav").removeClass('bg-transparent');
	  }
	  else{
			$("nav").addClass('bg-transparent');
		  $("nav").removeClass('bg-dark');  	
	  }
  });
});