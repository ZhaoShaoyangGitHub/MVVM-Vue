// 基类
class Vue {
  constructor(options) {
    // this.$el this.$data
    this.$el = options.el;
    this.$data = options.data;

    //这个根元素存在，编译模板
    if (this.$el) {
      new Compiler(this.$el, this);
    }
  }
}

class Compiler {
  constructor(el, vm) {
    // 判断el是否是一个元素
    this.el = this.isElementNode(el) ? el : document.querySelector(el);
    this.vm = vm;

    // 把当前节点放在内存中
    let fragment = this.nodeFragment(this.el);

    // 把节点中的内容替换

    // 编译模板 用数据编译
    this.compiler(fragment);

    // 吧内容在塞回到页面中

    this.el.appendChild(fragment);
  }

  // 是否是一个元素节点
  isElementNode(node) {
    return node.nodeType === 1;
  }

  //创建一个文档碎片
  nodeFragment(node) {
    const fragment = document.createDocumentFragment();
    let firstChild;
    while ((firstChild = node.firstChild)) {
      // appendChilren 具有移动性
      fragment.appendChild(firstChild);
    }
    return fragment;
  }

  // 编译内存中的dom节点
  compiler(fragment) {
    const childNodes = fragment.childNodes;
    [...childNodes].forEach((child) => {
      if (this.isElementNode(child)) {
        this.compilerElement(child);
      } else {
        this.compilerText(child);
      }
    });
  }

  // 编译元素
  compilerElement(node) {
    const attributes = node.attributes;
    [...attributes].forEach((attr) => {});
  }

  // 编译文本
  compilerText(node) {}
}
