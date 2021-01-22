class Vue {
  constructor(options) {
    //1.保存options上的数据
    this.$options = options || {}
    this.$data = options.data || {}
    this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el //获取el的dom节点
    this.$methods = options.$methods
    //2.通过Object.defineProperty把数据转成getter和setter，注入vue实例中
    this._proxyData(this.$data)
    //调用Observer类，监听数据的变化
    new Observer(this.$data)
    //调用compiler对象，解析指令和差值表达式,
    new Compiler(this)
  }

  _proxyData(data){
    //遍历所欲data
    Object.keys(data).forEach(key=>{
      //将data属性注入到vue中
      Object.defineProperty(this,key,{
        enumerable: true,
        configurable: true,
        get() {
          return data[key]
        },
        set(newVal){
          if(newVal === data[key]) return;
          data[key] = newVal;
        }
      })
    })
  }

}