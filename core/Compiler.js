class Compiler {
  constructor(vm) {
    this.vm = vm
    this.el = vm.$el
    this.compiler(this.el)
  }


  //编译模板，处理文本节点和元素节点
  compiler(el){
    const childNodes = el.childNodes;
    Array.from(childNodes).forEach(node=>{
      //处理文本节点
      if(this.isTextNode(node)){
        //节点nodeType === 3
        this.compilerText(node)
      }else if (this.isElementNode(node)){
        //元素节点 nodeType === 1
        this.compilerElement(node)
      }

      //判断node节点是否有子节点
      //如果有子节点，递归调用compile
      if(node.childNodes.length){
        this.compiler(node)
      }
    })
  }

  //编译元素节点，处理指令
  compilerElement(node){
    //遍历所有属性节点
    Array.from(node.attributes).forEach(attr=>{
      //判断是否v-开头指令
      let attrName = attr.name;
      if(this.isDirective(attrName)){
        //为了更优雅的处理不同方法，减去指令中的v-
        attrName = attrName.substr(2);
        const key = attr.value;
        this.update(node, key, attrName);
      }
    })
  }
  //执行对应指令的方法
  update(node, key, attrName){
    let updateFn = this[attrName + 'Updater'];
    //存在指令才执行对应方法
    updateFn && updateFn.call(this,node, this.vm[key], key)
  }

  //处理v-text指令
  textUpdater(node, value, attrName){
    node.textContent = value;
    //创建watcher对象，当数据改变时候更新视图
    new Watcher(this.vm, key, (newValue)=>{
      node.textContent = newValue;
    })
  }

  //处理v-model指令
  modelUpdater(node, value, key){
    node.value = value;
    //创建watcher对象，当数据改变时更新视图
    new Watcher(this.vm, key, (newValue)=>{
      node.value = newValue
    })

    //双向绑定
    node.addEventListener('input', ()=>{
      this.vm[key] = node.value
    })
  }

  //判断节点是否属于文本节点
  isTextNode(node){
    return node.nodeType === 3;
  }
  //判断节点是否为元素节点
  isElementNode(node){
    return node.nodeType === 1
  }
  //判断元素属性是否属于指令
  isDirective(attrName){
    return attrName.startsWith('v-');
  }
  //编译文本节点，处理插值表达式
  compilerText(node){
    const reg = /\{\{(.+?)\}\}/;
    const value = node.textContent;
    if(reg.test(value)){
      //只考虑一层的对象，如data.msg = 'hello world'， 不考虑嵌套的对象，切假设只有一个插值表达式
      const  key  = RegExp.$1.trim();
      node.textContent = value.replace(reg, this.vm[key])

      //创建watcher对象，当数据改变时更新视图
      new Watcher(this.vm, key, (newValue)=>{
        node.textContent = newValue;
      })
    }
  }
}