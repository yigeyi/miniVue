class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm
    //data中的属性名
    this.key = key
    //回调函数负责更新视图
    this.cb = cb
    //把watcher对象记录到Dep类的静态属性target中
    Dep.target = this
    //触发get方法，在get方法中调用addSub
    this.oldValue = vm[key]
    Dep.target = null
  }

  //当数据发生变化的时候更新视图
  update(){
    const newValue = this.vm[this.key];
    //数据没有发生变化直接返回
    if(this.oldValue === newValue){
      return ;
    }
    //更新视图
    this.cb(newValue)
  }
}