---
layout: blog-post
draft: false
date: 2020-07-12T03:50:39.689Z
title: vuex模块中使用namespaced之后的引用方法
description: 利用createNamespacedHelpers函数快速获取vuex模块的状态。
quote:
  content: ''
  author: ''
  source: ''
tags:
  - vue
  - vuex
  - namespaced
---
* store->index.js

```
export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules: {
    user
  }
})
```

* user.js

```
const state = {
  userName: 'ReSword'
}
const mutations = {
  //
}
const actions = {
  //
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
```

* xxxx组件

```
import { createNamespacedHelpers } from 'vuex'

computed: {
const { mapState } = createNamespacedHelpers('user')
     ...mapState({
         userName: state => state.userName
     })
}

或者
import { mapState } from 'vuex'

computed: {
...mapState('user', {
        userName: state => state.userName
    })
}
```