(function(){
  var b=document.getElementById("theme");
  if(b)b.addEventListener("click",function(){
    var n=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";
    document.documentElement.setAttribute("data-theme",n);
    try{localStorage.setItem("theme",n)}catch(e){}
  });
})();
