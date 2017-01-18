//detail.js
//获取应用实例
var app = getApp();
Page({
  data: {
    remind: '加载中',
    xfData: [], // 书籍数据
    listAnimation: {} // 列表动画
  },

  // 页面加载
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      book_name: options.name
    });
    //判断并读取缓存
    //if (app.cache.xf) { xfRender(app.cache.xf); }
    function xfRender(info) {
      // 为每一本书设置是否显示当前数据详情的标志open, false表示不显示
      var list = info.rows;
      for (var i = 0, len = list.length; i < len; ++i) {
        list[i].open = false;
      }
      list[0].open = true;
      _this.setData({
        remind: '',
        xfData: list,
        catalog: info.catalog
      });
    }
    wx.showNavigationBarLoading();
    wx.request({
      url: app.server + "/api/get_book_detail",
      method: 'POST',
      data: {
        session_id: app.user.wxinfo.id,
        url: options.url
      },
      success: function (res) {

        if (res.data && res.data.status === 200) {
          var info = res.data.data;
          if (info) {
            xfRender(info);
          } else { _this.setData({ remind: '暂无数据' }); }

        } else {
          app.removeCache('xf');
          _this.setData({
            remind: res.data.message || '未知错误'
          });
        }

      },
      fail: function (res) {
        if (_this.data.remind == '加载中') {
          _this.setData({
            remind: '网络错误'
          });
        }
        console.warn('网络错误');
      },
      complete: function () {
        wx.hideNavigationBarLoading();
      }
    });
  },

  // 展示书籍详情
  slideDetail: function (e) {

    var id = e.currentTarget.id,
      list = this.data.xfData;

    // 每次点击都将当前open换为相反的状态并更新到视图，视图根据open的值来切换css
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].barcode == id) {
        list[i].open = !list[i].open;
      } else {
        list[i].open = false;
      }
    }
    this.setData({
      xfData: list
    });
  }
});