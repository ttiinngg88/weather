Page({
    viewCity: function(e) {
        console.log(e)
        const city = e.currentTarget.dataset.city
        wx.navigateTo({
          url: '../city/city?cityName=' + city // 引向city页面，并把cityName变量传给city页面
        })
    }
})