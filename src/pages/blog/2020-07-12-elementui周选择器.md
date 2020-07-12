---
layout: blog-post
draft: false
date: 2020-07-12T03:52:37.083Z
title: elementui周选择器
description: >-
  elementui周选择器获取当前选中周，返回的数据是一个Mon May 04 2020 00:00:00 GMT+0800
  (中国标准时间)。。。这样的，我们需要自己处理一个格式问题。
quote:
  content: ''
  author: ''
  source: ''
tags:
  - element
---
下面介绍实现流程:

这是html，用的是elementui的周选择器，下面的input是为了展示用的，下面详细说:

```
<el-date-picker type="week" :editable="false" placeholder="报告期" v-model="value" format="yyyy年第WW周"
 @change="changeweek"></el-date-picker>
<el-input class="week-picker" v-model="weekTime" prefix-icon="el-icon-date" placeholder="报告期"></el-input>
```

这是js，绑定日期选择器的change事件:

```
changeweek(val){
      let firstDay = new Date(val.getFullYear(), 0, 1)  // 2020-01-01
      let dayOfWeek = firstDay.getDay()  // 2020-01-01是周三  dayOfWeek==3
      let spendDay = 1
      if (dayOfWeek != 0) {
        spendDay = 7 - dayOfWeek + 1   // 5 离下周一还有5天
      }
      firstDay = new Date(val.getFullYear(), 0, 1 + spendDay)   // 2020-01-06是2020年第一个周一，是2020年第二个周
      let d = Math.ceil((val.valueOf() - firstDay.valueOf()) / 86400000)   // 当前时间距离2020-01-06有几天
      let result = Math.ceil(d / 7)   // 换算成周为单位 2020-01-06result是0,但其实是第二个周，所以默认加2
      let year = val.getFullYear()
      let week = result + 2 //如果使用的是默认为加2（如果将自然周设置为周一到周日则是加1）
      //console.log(week)
      let startTime = this.$util.dateFormat(val.valueOf() - 86400000)   // 时间戳转字符串，$util是我们封装的方法
      let endTime = this.$util.dateFormat(val.valueOf() + 5*86400000)
      this.weekTime = startTime+'~'+endTime+'  第'+week+'周'   // 2020-05-10~2020-05-16 第20周
      this.payload.month = year+'-'+week
      //console.log(this.payload.month)
    },
```

现在数据都有了，怎么让显示的是我们想让他的显示的呢
我把想要显示的数据放在一个input里，加上icon看起来就是个日期选择器了，然后把这个input放在日期选择器的下面，最后把日期选择器的opacity设为0，让input能被看见，但是点击的时候点的其实还是日期选择器，原理就是这样，css很简单，就不放了。

```
<el-date-picker type="week" :editable="false" placeholder="报告期" v-model="value" format="yyyy年第WW周"
 @change="changeweek"></el-date-picker>
<el-input class="week-picker" v-model="weekTime" prefix-icon="el-icon-date" placeholder="报告期"></el-input>
```

后续发现没有clear了，修改下:
* opacity：0不要加给整个日期选择器，加给它里面的input就可以没这样选中数据的时候hover就会出现叉号了
* 样式实现了，接下来是数据问题，在changeWeek里加个判断，如果参数val是null的话清空input绑定的数据即可

```
if(!val){
   this.weekTime = '' // input绑定的数据
   this.payload.month = '' // 记录周，需要传给后端的数据    2020-18
}
```