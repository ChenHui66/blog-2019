---
layout: blog-post
draft: false
date: 2020-08-21T06:18:37.064Z
title: 'node环境：Error listen EADDRINUSE :::3000'
description: 错误原因：其实是3000端口被其他应用程序占用了，只要找到占用该端口的应用程序，杀死它，就好了。
quote:
  content: God helps those who help themselves.
  author: ''
  source: ''
tags:
  - 端口占用
  - netstat
  - taskkill
---
1. find process

```
netstat -o -n -a | findstr :3000
```
2. kill process

```
taskkill /F /PID 11176
```