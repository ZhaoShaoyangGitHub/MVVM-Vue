CompilerUtil = {
  getVal(vm, expr) {
    return expr.split(".").reduce((data, current) => {
      return data[current];
    }, vm.$data);
  },
  model(node, expr, vm) {
    // node 是节点 expr是表达式 vm 是当前实例
    let fn = this.updater["modelUpdater"];
    const value = this.getVal(vm, expr);
    fn(node, value);
  },
  html() {},
  text(node, expr, vm) {
    let fn = this.updater["textUpdater"];
    // expr = > {{a}} {{b}} {{c}}
    let content = expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
      console.log(args);
      return this.getVal(vm, args[1]);
    });
    fn(node, content);
  },
  updater: {
    // 把数据添加到节点中
    modelUpdater(node, value) {
      node.value = value;
    },
    textUpdater(node, value) {
      node.textContent = value;
    },
  },
};

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
        // 如果是元素 需要把自己传进去 遍历节点
        this.compiler(child);
      } else {
        this.compilerText(child);
      }
    });
  }

  // 判断是否是指令
  isDirective(attrName) {
    return attrName.startsWith("v-");
  }

  // 编译元素
  compilerElement(node) {
    const attributes = node.attributes;
    [...attributes].forEach((attr) => {
      const { name, value: expr } = attr;
      if (this.isDirective(name)) {
        const [, directive] = name.split("-");
        CompilerUtil[directive](node, expr, this.vm);
      }
    });
  }

  // 编译文本
  compilerText(node) {
    // 判断当前文本节点中内容是否包含{{xxxx}} {{xxxx}}
    const content = node.textContent;
    if (/\{\{(.+?)\}\}/.test(content)) {
      CompilerUtil["text"](node, content, this.vm);
    }
  }
}
