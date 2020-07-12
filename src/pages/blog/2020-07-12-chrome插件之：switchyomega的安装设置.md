---
layout: blog-post
draft: false
date: 2020-07-12T03:07:39.620Z
title: chrome插件之：SwitchyOmega的安装设置
description: >-
  既然有Shadowsocks为什么还要用SwitchyOmega？简单来说，就算启动Shadowsocks越墙而出，很多网站在PAC模式下无法打开。我就遇到一种情况，开启Shadowsocks后google.com在老掉牙的ie浏览器能够畅通，在最新版本的Chrome浏览器却无法通行。我借助SwitchyOmega配置一个代理到本地127.0.0.1的场景模式后，在所有浏览器畅通无阻。
quote:
  content: >-
    Our destiny offers not the cup of despair, but the chalice of opportunity.
    So let us seize it, not in fear, but in gladness. -- R.M. Nixon
  author: ''
  source: ''
tags:
  - SwitchyOmega
  - ''
---
## 插件介绍

SwitchyOmega是一款在Google Chrome 浏览器上的一个代理扩展程序，可以轻松快捷地管理和切换多个代理设置。

## 插件配置

1. Shadowsocks处于开启状态，模式为PAC
2. 安装插件–>新建情景模式–>选择代理服务器–>代理协议SOCKS5–>代理服务器：127.0.0.1–>代理端口：1080–>应用选项 ![](/img/shadowsocksmainset-1024x348-1.png)
3. 完成后点SwitchyOmega图标，选择auto switchj即可。然后当浏览网站的时候，当遇到需要全局代理的网站时，插件会以角标形式提示，然后选择自建的情景模式即可。比如下图的这个样子就需要启用我们自建的场景模式了。（前提是已设置为 自动切换模式）

      ![](/img/whenneedconfig.png)

      ![](/img/addselfscene.png)

   > 一个网站只要添加过一次情景模式，下次打开时将会自动判断，切换到代理模式。

    到此，你应该就可以正常冲浪了。

## 需要强调几个点

> 如果配置失败，可能是下面的情况之一或者两者都做错了

* Shadowsocks的代理端口没有：1080
* 把代理服务器写成Shadowsocks的服务器去了，比如下图的配置：
  ![](/img/attention.png)

## 添加自动代理规则

> 所有配置完成之后，留意SwitchyOmega的图标变化，如果有数字出现，就说明要手动添加一个条件。
鉴于网络上很多网站都需要代理，那么每次都要手动点击一次，能否略嫌麻烦？于是就用到规则列表

规则列表的作用在于，收入大部分需要代理的网站并自动加载，无需在手动添加
将以下网址复制到auto switch的规则列表设置中并立即更新：
https://raw.githubusercontent.com/gfwlist/gfwlist/master/gfwlist.txt