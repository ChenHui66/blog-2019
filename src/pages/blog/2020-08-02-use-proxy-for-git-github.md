---
layout: blog-post
draft: false
date: 2020-08-02T10:23:15.283Z
title: Use Proxy for Git/GitHub
description: >-
  如果linux配置了代理，比如shadowsocks结合SwitchyOmege等，那么git配置ssh的时候需要写入代理相关的配置，不然ssh的配置并不能正常的工作。
quote:
  content: >-
    You are simple, the world is a fairy tale; Heart is complex, the world is a
    maze.
  author: ''
  source: ''
tags:
  - linux
  - git
  - proxy
  - ssh
---
下面的配置假设你已经安装了git程序，并且生成并配置了ssh密钥。

Proxy for Git/GitHub的配置步骤：

1. 安装一个必须用到的包：

```
apt-get install netcat-openbsd
```

> 如果没有这个包，会产生如下的错误：/bin/nc: invalid option -- 'x'

2. 查看ssh配置文件：cat ~/.ssh/config 

```
# github.com
Host github.com
    Hostname ssh.github.com
    Port 443
    ServerAliveInterval 20
    User git
```

3. 新增配置:

```
ProxyCommand nc -x localhost:1080 %h %p
```

4. 最后配置：

```
Host github.com
    Hostname ssh.github.com
    ProxyCommand nc -x localhost:1080 %h %p
    Port 443
    ServerAliveInterval 20
    User git
```

5.测试ssh是否成功

```
ssh -T git@ssh.github.com
```

参考文章：

* [ssh: connect to host github.com port 22: Connection timed out](https://stackoverflow.com/questions/15589682/ssh-connect-to-host-github-com-port-22-connection-timed-out)
* [Use Proxy for Git/GitHub](https://gist.github.com/coin8086/7228b177221f6db913933021ac33bb92)
* [ssh client 通过 socks5 proxy 登录远程服务器](https://blog.chenxiaosheng.com/posts/2013-12-20/ssh-through-socks-proxy.html)