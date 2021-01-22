/**
 * Dep容器，data中每个属性都会对应一个，用来收集保存依赖
 * 依赖收集器
 */
class Dep {
  constructor() {
    //存放所有的观察者的数组
    this.subs = []
  }
  //添加观察者
  addSub(sub){
    if(sub && sub.update){
      this.subs.push(sub);
    }
  }
  //发送更新通知
  notify(){
    //TODO 这里把所有sub都拿出来通知不会多余吗？
    this.subs.forEach(sub=>{
      sub.update()
    })
  }
}