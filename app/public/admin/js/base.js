$(
  function(){
    app.initIfram()
    app.hideAside()
  }
)

var app = {
  initIfram:function(){
    var heights = document.documentElement.clientHeight
    document.getElementById('rightIfram').height = heights
  },
  hideAside:function(){
    $('.aside-ul>li:nth-child(-n+10) ul').hide()
    $('.aside h4').click(function(){
      $(this).siblings('ul').slideToggle();
    })
  }
}