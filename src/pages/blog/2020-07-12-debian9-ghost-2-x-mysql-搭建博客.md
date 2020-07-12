---
layout: blog-post
draft: false
date: 2020-07-12T02:05:47.380Z
title: debian9 + Ghost 2.X + MySQL 搭建博客
description: 我发现有许多类似的文章，但是大多都是过时的或者有许多我并不认为是最好的做法。所以打算自己写篇教程，希望可以帮助到需要的人。
quote:
  content: 'By other''s faults, wise men correct their own.'
  author: ''
  source: ''
tags:
  - Ghost
---
> 由于某些因素，ghost官方支持的linux系统是Ubuntu。有许多的人已经从各方面比较过Ubuntu和Debian,在这里我们并不打算再次讨论它们。我个人比较喜欢Debian。

我们从一个纯净的Debian系统开始
* 我们是root,先创建一个user。（注意：用户名不能是ghost）

```
adduser coolguy
```

* 把coolguy添加到sudoers,以后需要执行更高权限的命令。

```
usermod -aG sudo coolguy
```

* 切换到coolguy登陆

```
su - coolguy
```

* 更新软件包

```
sudo apt-get update
```

* 更新系统环境到最新

```
sudo apt-get upgrade
```

* 安装nginx

```
sudo apt-get install nginx
```

* 把node添加到源列表

```
curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -
```

* 安装nodejs

```
sudo apt-get install nodejs
```

* 安装数据库

```
sudo apt-get install mariadb-server
```

* 给数据库设置必要参数

```
sudo mysql_secure_installation
```

* 当前的root密码请直接按enter置空
* 选择不创建root密码
* 接下来的情况全部yes

为ghost设置数据库

* 进入数据库

```
sudo mysql
```

* 为ghost创建一个数据空间

```
CREATE DATABASE ghost_coolsite_db;
```

* 为刚创建的数据空间设置一个管理者并设置密码

```
CREATE USER 'ghost_coolsite_usr'@'localhost' IDENTIFIED BY 'my_password';
```

* 给数据空间管理者赋予全部权限

```
GRANT ALL PRIVILEGES ON ghost_coolsite_db.*   TO 'ghost_coolsite_usr'@'localhost';
```

* 退出数据库

```
exit
```

* 安装ghost-cli

```
sudo npm install ghost-cli@latest -g
```

* 为我们的站点创建一个安装目录

```
sudo mkdir -p /var/www/coolsite
```

* 设置目录的所有者

```
sudo chown coolguy:coolguy /var/www/coolsite
```

* 设置正确的权限

```
sudo chmod 775 /var/www/coolsite
```

* 导航到目录

```
cd /var/www/coolsite
```

安装ghost

* 使用ghsot-cli工具提供的命令

```
ghost install
```

* 下面是详细步骤
  * 选择yes,忽略提示非Ubuntu
  * 提供你的域名（eg:https://www.ghostf.com）
  * 按enter,选择默认localhost即可
  * 提供我们上面创建的数据空间的管理者
  * 管理者的密码
  * 数据空间的名字
  * 选择no,不创建Ghost database user
  * 选择yes,创建nginx
  * 如果你是https,选择yes自动设置ssl,然后你得提供一个email
  * 选择yes,设置systemd
  * 选择yes,启动你的ghost
  * 完成
