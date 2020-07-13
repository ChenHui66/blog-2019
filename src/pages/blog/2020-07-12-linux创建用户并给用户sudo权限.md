---
layout: blog-post
draft: false
date: 2020-07-12T01:56:52.394Z
title: linux创建用户并给用户sudo权限
description: 我经常看到博客说只要改/etc/sudoers文件就可以了。虽然这种方法可行，但是这种方法不利于管理用户。最重要的是，这种方法很low。
quote:
  content: Business before pleasure.
  author: ''
  source: ''
tags:
  - linux
  - sudo
---
我在这里将按如下步骤来详细的描述创建用户的过程。以用户名test为例：

1. 创建一个名为test的用户，且同时给他在home目录下面创建了文件夹

```
useradd -d /home/test -m test
```

2. 给test用户设置密码

```
passwd test
```

3. 把命令行的模式换为bash，默认是sh。你肯定会问为什么要这样，因为如果使用默认的sh，你打开终端的提示符显示的是$，不是“用户名$主机名”这种形式。

```
usermod -s /bin/bash test
```

4. 把test用户添加到sudo和admin用户组里面。这里要注意的是系统里面的admin的用户组的名字是”adm”

```
usermod -a -G sudo test
usermod -a -G adm test
```

5. 检查test所在的用户组

```
groups test
```

6. 重新登录一下，然后输入下面这个命令，密码就是使用该用户的密码，然后你就发现可以sudo了

```
sudo su
```