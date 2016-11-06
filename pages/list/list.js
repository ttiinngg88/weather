Page({
    data: {
        cities: [],
        cityWeathers: {}
    },
    viewCity: function(e) {
        console.log(e)
        const city = e.currentTarget.dataset.city
        wx.navigateTo({
          url: '../weather/weather?cityName=' + city // 引向city页面，并把cityName变量传给city页面
        })
    },
    addCity: function(e) {
        console.log(e)
        var that = this
        // 获得用户输入的城市名
        var cityName = e.detail.value.city
        // 如果用户输入的城市名为空，直接返回
        if (!cityName) {
            return
        }

        // 先告诉用户正在处理添加请求
        wx.showToast({
            title: '正在添加',
            icon: 'loading',
            duration: 10000
        })

        // 去查询这个城市的天气，如果查询失败则告诉用户，城市名有误
        wx.request({
            url: 'http://wthrcdn.etouch.cn/weather_mini?city='+cityName,
            data: {},
            header: {
                'Content-Type': 'application/json'
            },
            success: function (res) {
                // 请求完毕，把加载提示去掉
                wx.hideToast()

                console.log(res)
                // 根据API返回数据判断是否查询成功
                if (res.data.status === 1002){
                    // 查询失败
                    wx.showModal({
                        title: '没有找到您所输入的城市',
                        showCancel: false
                    })
                } else {
                    // 查询成功,把城市添加进来
                    var cities = that.data.cities
                    console.log(cities)
                    if (cities.indexOf(cityName) > -1) {
                        return
                    }
                    cities.push(cityName)
                    console.log(cities)
                    that.setData({
                        cities: cities
                    })
                    wx.setStorage({
                      key: 'cities',
                      data: cities
                    })
                }
            }
        })
    },

    loadWeather: function (city) {
        var that = this
        wx.request({
            url: 'http://wthrcdn.etouch.cn/weather_mini?city='+city,
            data: {},
            header: {
                'Content-Type': 'application/json'
            },
            success: function (res) {
                const weather = res.data.data
                that.setData({
                    
                })
                return {
                    temprature:weather.wendu, 
                    condition:weather.forecast[0].type
                }
            }
        })
    },

    deleteCity: function (e) {
        console.log('delete')
        var that = this
        const city = e.currentTarget.dataset.city
        var cities = that.data.cities
        cities.splice(cities.indexOf(city), 1)
        that.setData({
            cities: cities
        })
        wx.setStorage({
            key: 'cities',
            data: cities
        })
    },

    onLoad: function() {
        // 加载城市列表
        var cities = wx.getStorageSync('cities') || []
        this.setData({
            cities: cities
        })
        var cityWeathers = {}
        var that = this
        cities.map(function(city){
            that.loadWeather(city)
        })
    }
})