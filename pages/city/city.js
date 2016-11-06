Page({
    // data 就是要渲染到视图层的东西：本地城市的天气状况，从天气API获取
    data: {
        cityName: '', 
        temprature: 0,
        weather: {}
    },
    onLoad: function (option) {
        // 第一步，先获得城市名
        // option对象包含从别的页面传进的参数，所以在这里option包含从list页面传来的cityName属性
        console.log(option)
        // 如果是从list页面过来的，用户看指定城市的天气
        var cityName = option.cityName 
        
        // 如果没有cityName传递进来，那么通过API来获取cityName
        if (!cityName){
            // 先从微信api获得经纬度
            wx.getLocation({
                type: 'wgs84',
                success: function(res) {
                    var latitude = res.latitude
                    var longitude = res.longitude
                    // 根据经纬度去获取城市名  
                    wx.request({
                      url: 'http://api.map.baidu.com/geocoder/v2/?ak=LIkYxythH2yrgUE42GfgtkY56cLtTb51&location='+latitude+','+longitude+'&output=json&pois=0',
                      data: {},
                      header: {
                          'Content-Type': 'application/json'
                      }, // 设置请求的 header
                      success: function(res){
                          cityName = res.data.result.addressComponent.city.replace('市','')
                          console.log(cityName)
                        // success
                      }
                    })
                }
            })

        }
        this.setData({cityName: cityName})
        // 第二步，获得城市名之后，从天气API获取teampreature和weather的值
    },
    onReady: function() {
        wx.setNavigationBarTitle({
          title: this.data.cityName
        })
    }
})