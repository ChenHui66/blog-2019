---
layout: blog-post
draft: false
date: 2020-08-08T04:10:32.466Z
title: Debian10 安装mysql
description: Debian10使用了MariaDB 在APT的软件包存储库中并没有mysql。
quote:
  content: 'Without music, life is a journey through a desert.'
  author: ''
  source: ''
tags:
  - Debian
  - MySQL
---
最佳方式，在 *[这里下载](https://dev.mysql.com/downloads/)* MySQL Community Server 然后选择Debian时会出现建议使用 Mysql APT Repository 的安装方式。所以我们下载Mysql APT Repository，然后更新 APT Repository ，之后使用 apt-get 自动安装。这是最标准的安装方式。下面是具体步骤：
* 下载安装 Mysql APT Repository,然后执行下面语句：
```
sudo apt-get install ./Downloads/mysql-apt-config_0.8.14-1_all.deb
```
> 会弹出一个界面，全部默认安装直接选择ok就可以了。
* sudo apt-get update 可以看见已经有了mysql
* 现在安装 mysql-server
```
  sudo  apt-get install mysql-server
```
> 会弹出一个界面，设置root密码，安全验证选项选择推荐的强验证方式，完成确认即可。
* 然后就可以进去mysql了
```
mysql -u root -p
```
* 最后，进行一些安全设置
```
mysql_secure_installation
```
> 基本选择n就可以了，我习惯删除预设的test帐号和数据库。
* 安装和设置完毕，最后来看一眼安装了啥
```
apt list --installed | grep mysql
```
> 会列出一个安装的list
* 完成