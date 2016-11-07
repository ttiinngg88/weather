Page({
    // data 就是要渲染到视图层的东西：本地城市的天气状况，从天气API获取
    data: {
        city: '', 
        temprature: 0,
        condition: ''
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
                        var city = res.data.result.addressComponent.city.replace('市','')
                        wx.setNavigationBarTitle({
                            title: city
                        })
                        that.setData({
                            city: city
                        })
                        // 通过城市名获得天气
                        that.loadWeather(city)
                    }
                })
            }
        })
    },

    loadWeather: function (city) {
        const that = this;
        wx.request({
            url: 'http://wthrcdn.etouch.cn/weather_mini?city='+city,
            data: {},
            header: {
                'Content-Type': 'application/json'
            },
            success: function (res) {
                const weather = res.data.data
                console.log(res)
                that.setData({
                    temprature:weather.wendu, 
                    condition:weather.forecast[0].type
                })
                console.log(that.data)
            }
        })
    },

    onLoad: function (option) {
        // 第一步，先获得城市名
        // option对象包含从别的页面传进的参数，所以在这里option包含从list页面传来的city属性
        console.log(option)
        // 如果是从list页面过来的，用户看指定城市的天气
        var city = option.city 
        this.setData({city: city})
        // 通过城市名获得天气
        this.loadWeather(city)
        
        // 如果没有city传递进来，那么通过API来获取city
        if (!city){
            // 通过位置信息去获取当前城市及其天气
            this.loadCity()
        }
    },
    onReady: function() {
        wx.setNavigationBarTitle({
          title: this.data.city
        })
    }
})