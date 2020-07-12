---
layout: blog-post
draft: false
date: 2020-07-12T02:22:41.405Z
title: WordPress注册链接提示“您的密码重设链接无效”
description: >-
  如果你的WordPress站点刚搭建完成并尝试开启用户注册功能，此时你可能会遇到一些意想不到的麻烦：确认邮件发到了你的邮箱，你点击链接，却无法打开链接去设置密码，提示你您的密码重设链接无效，请在下方请求新链接。
quote:
  content: Nothing is impossible to a willing heart.
  author: ''
  source: ''
tags:
  - wordpress
---
> Google了一会后发现这样的问题不是我一个人遇到。这不是wordpress本身的问题，邮箱收到邮件后，误以为密码重置链接地址前后的“<>”一起当成链接地址生成超链接，点击链接后，由于传给wordpress的参数不对（多了个>），所以wordpress提示密码重设链接无效。

本问题主要影响忘记密码时的找回密码功能以及新用户注册，系统给新用户发送的密码设置功能。可通过以下两个步骤解决此问题：

解决找回密码时提示“您的密码重设链接无效”:

 1. 打开WP根目录下的 wp-login.php，找到如下代码（374行左右）：

```
$message .= 'u003c' . network_site_url(u0022wp-login.php?action=rpu0026key=$keyu0026login=u0022 . rawurlencode($user_login), 'login') . u0022u003e\r\nu0022;
```

2. 修改为：

```
$message .=network_site_url(u0022wp-login.php?action=rpu0026key=$keyu0026login=u0022 . rawurlencode ($user_login), 'login') . u0022\r\nu0022;
```

解决新用户注册时，点击邮件中的重置密码链接提示“您的密码重设链接无效”：

1. 打开WP安装目录下的/wp-includes/pluggable.php，找到如下代码（1741行左右）：

```
$message .= 'u003c' . network_site_url(u0022wp-login.php?action=rpu0026key=$keyu0026login=u0022 . rawurlencode ($user-u003euser_login), 'login') . u0022u003e\r\n\r\nu0022;
```

2. 修改为：

```
$message .= network_site_url(u0022wp-login.php?action=rpu0026key=$keyu0026login=u0022 . rawurlencode ($user-u003euser_login), 'login') . u0022\r\n\r\nu0022;
```

以上修改涉及到Wordpress源代码的修改，每次升级Wordpress后修改会被覆盖，必须重新进行以上修改。





