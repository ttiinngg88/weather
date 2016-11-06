Page({
    // data 就是要渲染到视图层的东西：本地城市的天气状况，从天气API获取
    data: {
        cityName: '', 
        temprature: 0,
        weather: {}
    },

    loadCity: function () {
        var that = this
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
                        var cityName = res.data.result.addressComponent.city.replace('市','')
                        wx.setNavigationBarTitle({
                            title: cityName
                        })
                        that.setData({
                            cityName: cityName
                        })
                        // 通过城市名获得天气
                        that.loadWeather(cityName)
                    }
                })
            }
        })
    },

    loadWeather: function (cityName) {

    },

    onLoad: function (option) {
        // 第一步，先获得城市名
        // option对象包含从别的页面传进的参数，所以在这里option包含从list页面传来的cityName属性
        console.log(option)
        // 如果是从list页面过来的，用户看指定城市的天气
        var cityName = option.cityName 
        this.setData({cityName: cityName})
        // 通过城市名获得天气
        this.loadWeather(cityName)
        
        // 如果没有cityName传递进来，那么通过API来获取cityName
        if (!cityName){
            // 通过位置信息去获取当前城市及其天气
            this.loadCity()
        }
    },
    onReady: function() {
        wx.setNavigationBarTitle({
          title: this.data.cityName
        })
    }
})