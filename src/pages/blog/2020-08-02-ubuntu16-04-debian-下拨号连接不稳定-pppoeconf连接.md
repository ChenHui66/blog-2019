---
layout: blog-post
draft: false
date: 2020-08-02T10:01:05.401Z
title: Ubuntu16.04(debian)下拨号连接不稳定(pppoeconf连接)
description: 在debian下开启dsl帐号密码拨号连接（需要安装pppoe和pppoeconf包），浏览网页经常断开不稳定，需要更改配置。
quote:
  content: 'I don''t want to be your entire world, just the best thing in it. '
  author: ''
  source: ''
tags:
  - linux
  - pppoe
  - pppoeconf
  - dsl
---
解决步骤：

1. 找到pppoeconf网络配置文件,先查看

```
sudo cat /etc/ppp/peers/dsl-provider
```

2. 修改配置文件，sudo vim /etc/ppp/peers/dsl-provider

```
# Configuration file for PPP, using PPP over Ethernet 
# to connect to a DSL provider.
#
# See the manual page pppd(8) for information on all the options.

##
# Section 1
#
# Stuff to configure...

# MUST CHANGE: Uncomment the following line, replacing the user@provider.net
# by the DSL user name given to your by your DSL provider.
# (There should be a matching entry in /etc/ppp/pap-secrets with the password.)
#user myusername@myprovider.net

# Use the pppoe program to send the ppp packets over the Ethernet link
# This line should work fine if this computer is the only one accessing
# the Internet through this DSL connection. This is the right line to use
# for most people.
#pty "/usr/sbin/pppoe -I eth0 -T 80 -m 1452"

# An even more conservative version of the previous line, if things
# don't work using -m 1452... 
#pty "/usr/sbin/pppoe -I eth0 -T 80 -m 1412"

# If the computer connected to the Internet using pppoe is not being used
# by other computers as a gateway to the Internet, you can try the following
# line instead, for a small gain in speed:
#pty "/usr/sbin/pppoe -I eth0 -T 80"


# The following two options should work fine for most DSL users.

# Assumes that your IP address is allocated dynamically
# by your DSL provider...
noipdefault
# Try to get the name server addresses from the ISP.
usepeerdns
# Use this connection as the default route.
# Comment out if you already have the correct default route installed.
defaultroute

##
# Section 2
#
# Uncomment if your DSL provider charges by minute connected
# and you want to use demand-dialing. 
#
# Disconnect after 300 seconds (5 minutes) of idle time.

#demand
#idle 300

##
# Section 3
#
# You shouldn't need to change these options...

hide-password
#原先20,调成200
lcp-echo-interval 200
#原先3,调成40
lcp-echo-failure 40
# Override any connect script that may have been set in /etc/ppp/options.
connect /bin/true
noauth
persist
#原先1417,调成130
mtu 130
#新增配置，重要，持续尝试接通
maxfail 0
#新增配置
holdoff 0

# RFC 2516, paragraph 7 mandates that the following options MUST NOT be
# requested and MUST be rejected if requested by the peer:
# Address-and-Control-Field-Compression (ACFC)
noaccomp
# Asynchronous-Control-Character-Map (ACCM)
default-asyncmap
plugin rp-pppoe.so
nic-enp0s25
# 新增配置
usepeerdns
user "2D"
```

3. 执行命令重新做拨号连接

```
sudo poff -a
pon dsl-provider
```

4.测试网速

```
$ ping www.baidu.com
PING www.a.shifen.com (220.181.112.244) 56(84) bytes of data.
64 bytes from 220.181.112.244 (220.181.112.244): icmp_seq=1 ttl=53 time=17.8 ms
64 bytes from 220.181.112.244 (220.181.112.244): icmp_seq=2 ttl=53 time=17.8 ms
64 bytes from 220.181.112.244 (220.181.112.244): icmp_seq=3 ttl=53 time=17.9 ms
64 bytes from 220.181.112.244 (220.181.112.244): icmp_seq=4 ttl=53 time=18.0 ms
64 bytes from 220.181.112.244 (220.181.112.244): icmp_seq=5 ttl=53 time=17.9 ms
64 bytes from 220.181.112.244 (220.181.112.244): icmp_seq=6 ttl=53 time=18.0 ms
64 bytes from 220.181.112.244 (220.181.112.244): icmp_seq=7 ttl=53 time=17.9 ms
64 bytes from 220.181.112.244 (220.181.112.244): icmp_seq=8 ttl=53 time=17.8 ms
64 bytes from 220.181.112.244 (220.181.112.244): icmp_seq=9 ttl=53 time=17.8 ms
64 bytes from 220.181.112.244 (220.181.112.244): icmp_seq=10 ttl=53 time=17.8 ms
```

[点击查看原文](https://blog.csdn.net/yucicheung/article/details/79065454)