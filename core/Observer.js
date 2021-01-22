/**
 * 观察者
 * 对数据进行观察
 */
class Observer {
  constructor(data) {
    //遍历data中的所有属性，把这些属性转成响应式数据
    this.walk(data)
  }
  walk(data) {
    if (!data || typeof data !== 'object') return;
    Object.keys(data).forEach(key=>{
      this.defineReactive(data, key, data[key]);
    })
  }

  //定义响应式数据
  //把data属性转成getter、setter
  defineReactive(obj, key, value){
    const that = this;
    //如果value是深层数据，使用递归方式使得深层属性也转成响应式数据
    this.walk(value);
    //data中的每一个属性都有对应的一个Dep容器，存放这所有依赖于该属性的依赖项
    //负责收集依赖，，每一个属性都有自己的依赖收集功能，这样子才能知道页面中哪些地方用到自己。
    let dep = new Dep();
    Object.defineProperty(obj,key,{
      configurable: true,
      enumerable: true,
      get(){
        // Dep.target && dep.addSub(Dep.target); //收集依赖
        if(Dep.target){
          //Dep.target存放具体的依赖，在编译阶段检测到依赖后就被赋值
          dep.addDep(Dep.target); // 收集依赖
        }
        return value;

      },
      set(newValue){
        if(newValue === value) return;
        value = newValue;
        that.walk(newValue); //修改后可能是对象，也需要转成响应式数据，set函数内部调用，所以需要修改this指向
        dep.notify();  //当数据发生变化的时候，通知所有的依赖进行更新显示
      }
    })

  }

}