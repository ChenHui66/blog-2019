---
layout: blog-post
draft: false
date: 2020-06-23T12:07:57.530Z
title: wordpress安装主题失败
description: >-
  Wordpress搭建博客。但是坑难免还是要踩的，下面说一下此次采坑要点。

  wordpress后台管理里面，我惊奇的发现不能安装自己喜欢的主题。弹窗要求输入ftp验证。而我输入了正确的ftp账户和密码，却“言而无信”的提示说无法连接到我的主机。
quote:
  content: Beware beginnings.
  author: ''
  source: ''
tags:
  - wordpress
---
## 尝试用第一种解决办法

<!--StartFragment-->

```
define("FS_METHOD","direct");
define("FS_CHMOD_DIR", 0777);
define("FS_CHMOD_FILE", 0777);
```

<!--EndFragment-->

重启服务器，再重新尝试安装主题和插件：

> 安装主题失败，无法创建目录

## 尝试第二种…

<!--StartFragment-->

```
chmod 777 /opt/lampp/htdocs/wordpress/mp-content
chmod 777 /opt/lampp/htdocs/wordpress/mp-content/plugins
```

<!--EndFragment-->

重启服务器，再重新尝试安装主题和插件：
> 安装主题失败，无法复制文件
## 正确的做法
我们cd /opt/lampp/htdocs/执行操作：
```
chown -R daemon:daemon wordpress
```

重启服务器，到此，完美解决！