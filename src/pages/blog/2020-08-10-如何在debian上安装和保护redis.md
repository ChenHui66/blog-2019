---
layout: blog-post
draft: false
date: 2020-08-10T14:46:08.675Z
title: 如何在Debian上安装和保护Redis
description: Redis是一个内存中的键值存储，以其灵活性，性能和广泛的语言支持而闻名。本教程演示如何在Debian服务器上安装，配置和保护Redis。
quote:
  content: 'All the ending is a new beginning, just don''t know at that time.'
  author: ''
  source: ''
tags:
  - Debian
  - Redis
---
## 先决条件

要完成本指南，您需要访问具有sudo权限且配置了基本防火墙的非`root`用户的`Debian`服务器。 您可以按照我们的[初始服务器设置指南进行设置](https://www.howtoing.com/initial-server-setup-with-debian-9/)。

## 安装和配置Redis
为了获得最新版本的`Redis`，我们将使用`apt`从官方`Debian`存储库安装它。更新您的本地apt包缓存并通过键入以下命令安装`Redis`:

```shell
$> sudo apt-get update && apt-get install redis-server
```

这将下载并安装`Redis`及其依赖项。在此之后，`edis`配置文件中将进行一项重要的配置更改，该文件是在安装期间自动生成的。

使用首选文本编辑器打开此文件:

```
$> sudo vim /etc/redis/redis.conf
```
在文件中，找到受`supervised`指令。该指令允许您声明一个`init`系统来管理`Redis`作为服务，使您可以更好地控制其操作。默认情况下，`supervised`指令设置为`no` 。由于您运行的是使用`systemd init`系统的`Debian`，因此将其更改为`systemd`:

```
. . .

# If you run Redis from upstart or systemd, Redis can interact with your
# supervision tree. Options:
#   supervised no      - no supervision interaction
#   supervised upstart - signal upstart by putting Redis into SIGSTOP mode
#   supervised systemd - signal systemd by writing READY=1 to $NOTIFY_SOCKET
#   supervised auto    - detect upstart or systemd method based on
#                        UPSTART_JOB or NOTIFY_SOCKET environment variables
# Note: these supervision methods only signal "process is ready."
#       They do not enable continuous liveness pings back to your supervisor.
supervised systemd

. . .
```

这是此时您需要对`Redis`配置文件进行的唯一更改，因此请在完成后保存并关闭它。然后，重新加载`Redis`服务文件以反映您对配置文件所做的更改：

```shell
$> sudo systemctl restart redis
```

有了这个，你已经安装并配置了`Redis`，它正在你的机器上运行。但是，在开始使用它之前，首先要检查`Redis`是否正常运行是明智的。

## 测试Redis

与任何新安装的软件一样，在对其配置进行任何进一步更改之前，确保`Redis`按预期运行是个好主意。我们将通过一些方法来检查`Redis`在此步骤中是否正常工作。

首先检查`Redis`服务是否正在运行:

```shell
$> sudo systemctl status redis
```

如果它正在运行而没有任何错误，则此命令将生成类似于以下内容的输出:

```shell
● redis-server.service - Advanced key-value store
   Loaded: loaded (/lib/systemd/system/redis-server.service; enabled; vendor preset: enabled)
   Active: active (running) since Wed 2018-09-05 20:19:44 UTC; 41s ago
     Docs: http://redis.io/documentation,
           man:redis-server(1)
  Process: 10829 ExecStopPost=/bin/run-parts --verbose /etc/redis/redis-server.post-down.d (code=exited, status=0/SUCCESS)
  Process: 10825 ExecStop=/bin/kill -s TERM $MAINPID (code=exited, status=0/SUCCESS)
  Process: 10823 ExecStop=/bin/run-parts --verbose /etc/redis/redis-server.pre-down.d (code=exited, status=0/SUCCESS)
  Process: 10842 ExecStartPost=/bin/run-parts --verbose /etc/redis/redis-server.post-up.d (code=exited, status=0/SUCCESS)
  Process: 10838 ExecStart=/usr/bin/redis-server /etc/redis/redis.conf (code=exited, status=0/SUCCESS)
  Process: 10834 ExecStartPre=/bin/run-parts --verbose /etc/redis/redis-server.pre-up.d (code=exited, status=0/SUCCESS)
 Main PID: 10841 (redis-server)
    Tasks: 3 (limit: 4915)
   CGroup: /system.slice/redis-server.service
           └─10841 /usr/bin/redis-server 127.0.0.1:6379
. . .
```

在这里，您可以看到Redis正在运行并且已经启用，这意味着它设置为每次服务器启动时启动。

> 注意：此设置适用于Redis的许多常见用例。但是，如果您希望每次服务器引导时手动启动Redis，则可以使用以下命令对其进行配置：

```shell
$> sudo systemctl disable redis
```

要测试Redis是否正常运行，请使用命令行客户端连接到服务器:

```shell
redis-cli
```

在随后的提示中，使用`ping`命令测试连接:

```shell
127.0.0.1:6379> ping
```
Output

```shell
127.0.0.1:6379> PONG
```
此输出确认服务器连接仍处于活动状态。接下来，检查您是否可以通过运行来设置密钥：

```shell
127.0.0.1:6379> set test "It's working!"
```
Output:

```shell
ok
```
键入以下内容检索值：

```shell
127.0.0.1:6379> get test
```
假设一切正常，您将能够检索存储的值：

```shell
127.0.0.1:6379> "It's working!"
```

确认您可以获取该值后，退出Redis提示符以返回到shell:

```shell
127.0.0.1:6379> exit
```

这样，您的Redis安装即可完全运行，随时可供您使用。但是，它的某些默认配置设置不安全，并为恶意攻击者提供攻击和访问服务器及其数据的机会。本教程中的其余步骤涵盖了减轻这些漏洞的方法，正如Redis官方网站所规定的那样。虽然这些步骤是可选的，如果您选择不遵循它们，Redis仍然可以运行，强烈建议您完成它们以加强系统的安全性。

## 绑定到localhost

默认情况下，只能从localhost访问Redis。但是，如果您通过遵循与此不同的教程来安装和配置Redis，则可能已更新配置文件以允许来自任何位置的连接。这不如绑定到localhost那样安全。

要更正此问题，请打开Redis配置文件进行编辑:

```shell
$> sudo nano /etc/redis/redis.conf
```

找到此行并确保它已取消注释(如果存在则删除#):

```
bind 127.0.0.1
```
完成后保存并关闭文件。然后，重新启动服务以确保systemd读取您的更改:

```shell
$> sudo systemctl restart redis
```

要检查此更改是否已生效，请运行以下`netstat`命令：

```shell
$> sudo netstat -lnp | grep redis
```

看到如下输出:

```shell
tcp        0      0 127.0.0.1:6379          0.0.0.0:*               LISTEN      8092/redis-server 1 
tcp6       0      0 ::1:6379                :::*                    LISTEN      8092/redis-server 1 
```

此输出显示redis-server程序绑定到`localhost(127.0.0.1)`，反映您刚刚对配置文件所做的更改。如果您在该列中看到另一个IP地址(例如，`0.0.0.0`)，则应仔细检查是否取消注释了正确的行并再次重新启动Redis服务。

现在您的Redis安装仅在localhost上进行监听，恶意攻击者更难以发出请求或访问您的服务器。但是，Redis当前未设置为要求用户在更改其配置或其所拥有的数据之前进行身份验证。为了解决这个问题，Redis允许您在通过Redis客户端(redis-cli)进行更改之前要求用户使用密码进行身份验证。

## 配置Redis密码

配置Redis密码可启用其两个内置安全功能之一`auth`命令，该命令要求客户端进行身份验证以访问数据库。密码直接在Redis的配置文件`/etc/redis/redis.conf`配置，因此请使用首选编辑器再次打开该文件：

```shell
sudo vim /etc/redis/redis.conf
```
查找`requirepass foobared`

通过删除#取消注释，并将`foobared`更改为安全密码。

设置密码后，保存并关闭文件，然后重新启动Redis:

```shell
$> sudo systemctl restart redis.service
```
要测试密码是否有效，请访问Redis命令行:

```shell
$> redis-cli
```
以下显示了用于测试Redis密码是否有效的一系列命令。第一个命令尝试在验证之前将密钥设置为值：

```shell
127.0.0.1:6379> set key1 10
```
这不起作用，因为您没有进行身份验证，因此Redis返回错误:

```shell
127.0.0.1:6379> (error) NOAUTH Authentication required.
```

下一个命令使用Redis配置文件中指定的密码进行身份验证:

```shell
127.0.0.1:6379> auth your_redis_password
```

Redis承认:

```shell
127.0.0.1:6379> ok
```

之后，再次运行上一个命令将成功:

```shell
127.0.0.1:6379> set key1 10
```
然后退出`redis-cli`:

```shell
127.0.0.1:6379> exit
```

参考文章：
[如何在Debian 9上安装和保护Redis](https://www.howtoing.com/how-to-install-and-secure-redis-on-debian-9)








