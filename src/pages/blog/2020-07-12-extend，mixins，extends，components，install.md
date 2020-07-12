---
layout: blog-post
draft: false
date: 2020-07-12T03:27:09.866Z
title: extend，mixins，extends，components，install
description: >-
  你知道extend,mixins,extends，components,install用法吗? 你知道他们的区别吗? 你知道他们的执行顺序嘛?
  下面都能找到这些答案。
quote:
  content: >-
    There is no such thing as a great talent without great will - power. --
    Balzac
  author: ''
  source: ''
tags:
  - extend
  - mixins
  - extends
  - components
  - install
---
## Vue.extend

* 使用vue构造器,创建一个子类,参数是包含组件选项的对象;
* 是全局的

```
// 创建构造器
var Profile = Vue.extend({
  template: '<p>{{extendData}}</br>实例传入的数据为:{{propsExtend}}</p>',//template对应的标签最外层必须只有一个标签
  data: function () {
    return {
      extendData: '这是extend扩展的数据',
    }
  },
  props:['propsExtend']
})
// 创建 Profile 实例，并挂载到一个元素上。可以通过propsData传参.
new Profile({propsData:{propsExtend:'我是实例传入的数据'}}).$mount('#app-extend')
```

结论: Vue.extend实际是创建一个构造器,对应的初始化构造器,并将其挂载到标签。

## Vue.component

* 将通过 Vue.extend 生成的扩展实例构造器注册（命名）为一个全局组件,参数可以是Vue.extend()扩展的实例,也可以是一个对象(会自动调用extend方法)
* 两个参数,一个组件名,一个extend构造器或者对象

```
//1.创建组件构造器
  var obj = {
    props: [],
    template: '<div><p>{{extendData}}</p></div>',//最外层只能有一个大盒子,这个和<tempalte>对应规则一致
    data: function () {
      return {
        extendData: '这是Vue.component传入Vue.extend注册的组件',
      }
    },
  };

  var Profile = Vue.extend(obj);

  //2.注册组件方法一:传入Vue.extend扩展过得构造器
  Vue.component('component-one', Profile)

  //2.注册组件方法二:直接传入
  Vue.component('component-two', obj)

  //3.挂载
  new Vue({
    el: '#app'
  });

  //获取注册的组件 (始终返回构造器)
  var oneComponent=Vue.component('component-one');
  console.log(oneComponent===Profile)//true,返回的Profile构造器
```
## mixins

值可以是一个混合对象数组,混合实例可以包含选项,将在extend将相同的选项合并 mixins代码:

```
 var mixin={
    data:{mixinData:'我是mixin的data'},
    created:function(){
      console.log('这是mixin的created');
    },
    methods:{
      getSum:function(){
        console.log('这是mixin的getSum里面的方法');
      }
    }
  }

  var mixinTwo={
    data:{mixinData:'我是mixinTwo的data'},
    created:function(){
      console.log('这是mixinTwo的created');
    },
    methods:{
      getSum:function(){
        console.log('这是mixinTwo的getSum里面的方法');
      }
    }
  } 

  var vm=new Vue({
    el:'#app',
    data:{mixinData:'我是vue实例的data'},
    created:function(){
      console.log('这是vue实例的created');
    },
    methods:{
      getSum:function(){
        console.log('这是vue实例里面getSum的方法');
      }
    },
    mixins:[mixin,mixinTwo]
  })
  
  //打印结果为:
  这是mixin的created
  这是mixinTwo的created
  这是vue实例的created
  这是vue实例里面getSum的方法
```

## extends

extends用法和mixins很相似,只不过接收的参数是简单的选项对象或构造函数,所以extends只能单次扩展一个组件

```
var extend={
    data:{extendData:'我是extend的data'},
    created:function(){
      console.log('这是extend的created');
    },
    methods:{
      getSum:function(){
        console.log('这是extend的getSum里面的方法');
      }
    }
  }

  var mixin={
    data:{mixinData:'我是mixin的data'},
    created:function(){
      console.log('这是mixin的created');
    },
    methods:{
      getSum:function(){
        console.log('这是mixin的getSum里面的方法');
      }
    }
  }
  
    
  var vm=new Vue({
    el:'#app',
    data:{mixinData:'我是vue实例的data'},
    created:function(){
      console.log('这是vue实例的created');
    },
    methods:{
      getSum:function(){
        console.log('这是vue实例里面getSum的方法');
      }
    },
    mixins:[mixin],
    extends:extend
  })
  
  //打印结果
  这是extend的created
  这是mixin的created
  这是vue实例的created
  这是vue实例里面getSum的方法
```

* extends执行顺序为:extends>mixins>mixinTwo>created
* 定义的属性覆盖规则和mixins一致

## components

注册一个局部组件

```
//1.创建组件构造器
  var obj = {
    props: [],
    template: '<div><p>{{extendData}}</p></div>',//最外层只能有一个大盒子,这个和<tempalte>对应规则一致
    data: function () {
      return {
        extendData: '这是component局部注册的组件',
      }
    },
  };

  var Profile = Vue.extend(obj);
  
  //3.挂载
  new Vue({
    el: '#app',
    components:{
      'component-one':Profile,
      'component-two':obj
    }
  });
```

## install

* 是开发vue的插件,这个方法的第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象(可选)
* vue.use方法可以调用install方法,会自动阻止多次注册相同插件

```
 var MyPlugin = {};
  MyPlugin.install = function (Vue, options) {
    // 2. 添加全局资源,第二个参数传一个值默认是update对应的值
    Vue.directive('click', {
      bind(el, binding, vnode, oldVnode) {
        //做绑定的准备工作,添加时间监听
        console.log('指令my-directive的bind执行啦');
      },
      inserted: function(el){
      //获取绑定的元素
      console.log('指令my-directive的inserted执行啦');
      },
      update: function(){
      //根据获得的新值执行对应的更新
      //对于初始值也会调用一次
      console.log('指令my-directive的update执行啦');
      },
      componentUpdated: function(){
      console.log('指令my-directive的componentUpdated执行啦');
      },
      unbind: function(){
      //做清理操作
      //比如移除bind时绑定的事件监听器
      console.log('指令my-directive的unbind执行啦');
      }
    })

    // 3. 注入组件
    Vue.mixin({
      created: function () {
        console.log('注入组件的created被调用啦');
        console.log('options的值为',options)
      }
    })

    // 4. 添加实例方法
    Vue.prototype.$myMethod = function (methodOptions) {
      console.log('实例方法myMethod被调用啦');
    }
  }

  //调用MyPlugin
  Vue.use(MyPlugin,{someOption: true })

  //3.挂载
  new Vue({
    el: '#app'
  });
```

## 各个方法之间的关系

Vue.extend和Vue.component是为了创建构造器和组件; mixins和extends是为了拓展组件; install是开发插件; 总的顺序关系: Vue.extend>Vue.component>extends>mixins


