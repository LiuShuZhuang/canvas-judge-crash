// components/scheme-zrender/scheme-zrender.js
var zrender = require('../../static/zrender/zrender')
var CircleShape = require('../../static/zrender/graphic/shape/Circle')
var PolylineShape = require('../../static/zrender/graphic/shape/Polyline')
var PolygonShape = require('../../static/zrender/graphic/shape/Polygon')
var ZText = require('../../static/zrender/graphic/Text')
var StarShape = require('../../static/zrender/graphic/shape/Star')
var WeCanvas = require('../../static/zrender/WeCanvas')

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes:{
    ready: function (e) {
      var star = new StarShape({
        style: {
          lineDash: [10, 5],
          stroke: 'black'
        },
        shape: {
          n: 5,
          r: 50,
          cx: 50,
          cy: 80
        }
      });
  
      var ctx1 = new WeCanvas("canvas-1",this);
      var zr1 = zrender.init(ctx1);
      zr1.add(star);

    },
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
