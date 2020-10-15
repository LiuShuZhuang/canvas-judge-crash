// components/scheme-canvas/scheme-canvas.js
const {pixelScale} = getApp().globalData;
const app = getApp();

let dbClickTimer; //双击定时器
let crash;  //canvas

//normal 正常状态
//main 主要撞点
//minor 次要撞点

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    collisionPoints: Array,
    canvasShow: Boolean,
  },
  observers:{
    'canvasShow':function(newVal){
      this.canvasInit();
    }
  },
  lifetimes: {
    ready(){
      wx.createSelectorQuery().in(this).select('#crash').boundingClientRect(rect=>{
        this.setData({rectTop: rect.top})
      }).exec()
      this.canvasInit();
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    sum: 10, //碰撞点总数
    canvasImage: '',
    rectTop: '0'
    // canvasImageShow: false
  },
  /**
   * 组件的方法列表
   */
  methods: {
    canvasClick(e){ //canvas 点击事件
      let {x,y} = e.detail;
      let click = {
        x: x/pixelScale,
        y: (y-this.data.rectTop)/pixelScale
      }
      let origin = {
        x:375,
        y:275
      }
      let standard = {
        x: 375,
        y: 0
      }
      let distance = this.getDistance(origin,click);
      if(200<=distance&&distance<=250){ //点击位于圆弧之内
        let angle = this.getAngle({
          x: standard.x-origin.x,
          y: standard.y-origin.y
        },{
          x: click.x-origin.x,
          y: click.y-origin.y
        })+18

        let clickIndex = Math.ceil(angle/36)-1;
        
        this.judgeClick(clickIndex) //判断双击
      }
    },
    judgeClick(clickIndex){
      let thatTimeStamp = (new Date()).getTime(); //获取当前时间戳
      let thatIndex = clickIndex%this.data.sum;
      
      if(thatTimeStamp - app.globalData.touchCrashTimeStamp<300 && app.globalData.touchCrashIndex==thatIndex){  //判断双击
        this.data.collisionPoints = this.data.collisionPoints.map((item,index)=>{
          if(item.type=='main'&&index ==thatIndex){
            item.type='normal'
          } else if(item.type!='main'&&index ==thatIndex){
            item.type='main'
          }else  if(item.type=='main'&&index !=thatIndex){
            item.type='normal' 
          }
          return item
        })
        this.triggerEvent('getinfo',this.data.collisionPoints);
        this.canvasInit();

        app.globalData.touchCrashTimeStamp=0
        app.globalData.touchCrashIndex=thatIndex

        clearTimeout(dbClickTimer);
      }else{
        app.globalData.touchCrashTimeStamp=thatTimeStamp
        app.globalData.touchCrashIndex=thatIndex
        
        if(this.data.collisionPoints[thatIndex].type!='normal'){
          this.data.collisionPoints[thatIndex].type = 'normal'
        }else{
          this.data.collisionPoints[thatIndex].type = 'minor'
        }

        this.triggerEvent('getinfo',this.data.collisionPoints);
        this.canvasInit();
      }
    },
    getAngle: ({ x: x1, y: y1 }, { x: x2, y: y2 }) => {   //获取角度
      const dot = x1 * x2 + y1 * y2
      const det = x1 * y2 - y1 * x2
      const angle = Math.atan2(det, dot) / Math.PI * 180
      return Math.round(angle + 360) % 360
    },
    getDistance(a,b){  //获取两点的距离
      let height = a.y-b.y;
      let width = a.x-b.x;

      return Math.sqrt(height*height+width*width);
    },
    canvasInit(){ //canvas初始化
      crash = wx.createCanvasContext('crash',this);

      let borderColor,bgColor,lineColor;

      this.setPixelScale(crash);
      crash.translate(179,92);
      crash.drawImage('../../img/collision-point-car.png',0,0,192,366);
      crash.translate(-179,-92);
      this.resetPixelScale(crash);

      for(let i=0;i<this.data.sum;i++){   //处理色块和边框
        if(i!=0){   //重置大小
          this.resetPixelScale(crash);
        }

        if(this.data.collisionPoints[i].type=='minor'){   //赋值颜色
          borderColor = '#1085C8'
          bgColor = '#1085C8'
        }else if(this.data.collisionPoints[i].type=='main'){
          borderColor = '#DC5341'
          bgColor = '#DC5341'
        }else{
          borderColor = '#1085C8'
          bgColor = '#fff'
        }

        crash.beginPath();  //边框和背景
        crash.setStrokeStyle(borderColor);
        crash.setLineWidth('4');
        crash.setFillStyle(bgColor);
        crash.arc(275,275,250,this.angle(i*36-18),this.angle(36*(i+1)-18));
        crash.arc(275,275,200,this.angle(36*(i+1)-18),this.angle(i*36-18),true);
        crash.closePath();
        
        this.setPixelScale(crash);
        crash.fill(); //先填充
        crash.stroke(); //后绘制
      }

      for(let i=0;i<this.data.sum;i++){   //处理线条
        if(this.data.collisionPoints[i].type=='minor'){   //赋值颜色
          lineColor = '#fff'
        }else if(this.data.collisionPoints[i].type=='main'){
          lineColor = '#fff'
        }else{
          lineColor = '#1085C8'
        }

        crash.beginPath();
        crash.setStrokeStyle(lineColor);
        crash.translate(275,275);
        crash.setLineWidth('4');
        crash.moveTo(-25,-230);
        crash.lineTo(0,-220);
        crash.lineTo(25,-230);
        if(i==0){ //首次旋转18
          crash.rotate( 0 * Math.PI/180);
        }else{  //后面旋转36
          crash.rotate( 36 * Math.PI/180);
        }
        crash.stroke();
        crash.translate(-275,-275);
      }

      for(let i=0;i<this.data.sum;i++){   //处理左边线
        if(this.data.collisionPoints[i].type=='main'){
          crash.beginPath();
          crash.setStrokeStyle('#DC5341');
          crash.translate(275,275);
          crash.setLineWidth('4');
          crash.moveTo(0,-198);
          crash.lineTo(0,-252);
          crash.rotate( (i*36+54) * Math.PI/180);
          crash.stroke();
          crash.translate(-275,-275);

          if(i==0){ //第一个需要两边修补
            crash.beginPath();
            crash.setStrokeStyle('#DC5341');
            crash.translate(275,275);
            crash.setLineWidth('4');
            crash.moveTo(0,-198);
            crash.lineTo(0,-252);
            crash.rotate( (i*36-36) * Math.PI/180);
            crash.stroke();
            crash.translate(-275,-275);
          }
        }
      }
      crash.draw(false,()=>{
        wx.canvasToTempFilePath({
          canvasId: 'crash',
          success: (res) =>{
            this.setData ({
              canvasImage: res.tempFilePath
            })
          },
          fail:function(err){
            console.log(err)
          }
        },this)
      });
    },
    angle(num){ //处理角度
      num = num-90;
      num = num<0?360+num:num;
      return 2*Math.PI/360*num
    },
    setPixelScale(){ //同比放大缩小
      crash.scale(pixelScale,pixelScale);
    },
    resetPixelScale(){ //同比放大缩小
      crash.scale(1/pixelScale,1/pixelScale);
    }
  }
})
