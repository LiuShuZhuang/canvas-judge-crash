const app = getApp();

Page({
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () {},
      fail: function () {}
    }
  },
  data: {
    scrollTop: 0,  //滚动条长度
    collisionPoints: [
      {
        type: 'main'
      },
      {
        type: 'normal'
      },
      {
        type: 'normal'
      },
      {
        type: 'minor'
      },
      {
        type: 'minor'
      },
      {
        type: 'normal'
      },
      {
        type: 'normal'
      },
      {
        type: 'normal'
      },
      {
        type: 'normal'
      },
      {
        type: 'normal'
      },
    ],
    canvasShow: true
  },
  onReady() {
   
  },
  onLoad(){
   
  },
  changeSwitchShow(){
    this.setData({
      canvasShow: false
    })

    setTimeout(() => {
      this.setData({
        canvasShow: true
      })
    }, 2000);
  },
  changeCollisionPoints(e){
    this.setData({
      collisionPoints:e.detail
    })
  }
});
