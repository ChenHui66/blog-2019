---
layout: blog-post
draft: false
date: 2020-08-08T04:36:06.652Z
title: Debian10 buster 安装 mysql workbench
description: >-
  之前仓库一直都有 mysql-workbench, 通过配置一下mysql-apt-config 就直接可以apt install
  mysql-workbench-community 了, 但是因为workbench 在buster发版的时候有致命的bug, 导致最后没有被吸收进仓库.
quote:
  content: A happy family life is a wonderful asset for any one.
  author: ''
  source: ''
tags:
  - Debain
  - MySQL workbench
---
我们仍然可以下载.deb包的方式，安装workbench。

* 去 https://dev.mysql.com/downloads/workbench/ 选择ubuntu(18.xx)

* 去到文件目录后安装

```
sudo dpkg -i  mysql-workbench-community_8.0.21-1ubuntu18.04_amd64.deb 
```

* 会提示有依赖问题

```
正在选中未选择的软件包 mysql-workbench-community。
(正在读取数据库 ... 系统当前共安装有 181871 个文件和目录。)
准备解压 mysql-workbench-community_8.0.21-1ubuntu18.04_amd64.deb  ...
正在解压 mysql-workbench-community (8.0.21-1ubuntu18.04) ...
dpkg: 依赖关系问题使得 mysql-workbench-community 的配置工作不能继续：
 mysql-workbench-community 依赖于 libzip4 (>= 0.10)；然而：
  未安装软件包 libzip4。

dpkg: 处理软件包 mysql-workbench-community (--install)时出错：
 依赖关系问题 - 仍未被配置
正在处理用于 gnome-menus (3.31.4-3) 的触发器 ...
正在处理用于 desktop-file-utils (0.23-4) 的触发器 ...
正在处理用于 mime-support (3.62) 的触发器 ...
正在处理用于 hicolor-icon-theme (0.17-2) 的触发器 ...
正在处理用于 shared-mime-info (1.10-1) 的触发器 ...
在处理时有错误发生：mysql-workbench-community
```

* 按照提示修复依赖关系即可


