---
layout: blog-post
draft: false
date: 2020-07-12T01:29:00.796Z
title: linux+xampp服务器配置https证书
description: linux+xampp服务器配置https证书，分步骤详细说明。
quote:
  content: Brevity is the soul of wit.
  author: ''
  source: ''
tags:
  - https
  - ssl
  - wordpress
  - xampp
  - linux
---
## 去腾讯云申请SSL证书（有免费一年的）

去阿里云申请也可以，本文只是案例而已。

## 上传文件（只需要Apache目录下的三个文件）

* 将1_root_bundle.crt文件上传到/opt/lampp/etc目录下
* 将2_www.xxxxx.com.crt文件上传到/opt/lampp/etc/ssl.crt目录下
* 将3_www.xxxxx.com.key文件上传到/opt/lampp/etc/ssl.key目录下

## 编辑httpd-ssl.conf文件

```
vi /opt/lampp/etc/extra/httpd-ssl.conf
找到

更改成以下

#   General setup for the virtual host
DocumentRoot "/opt/lampp/htdocs"
ServerName www.example.com:443
ServerAdmin you@example.com
ErrorLog "/opt/lampp/logs/error_log"
TransferLog "/opt/lampp/logs/access_log"

#   SSL Engine Switch:
#   Enable/Disable SSL for this virtual host.
SSLEngine on

#   Server Certificate:
#   Point SSLCertificateFile at a PEM encoded certificate.  If
#   the certificate is encrypted, then you will be prompted for a
#   pass phrase.  Note that a kill -HUP will prompt again.  Keep
#   in mind that if you have both an RSA and a DSA certificate you
#   can configure both in parallel (to also allow the use of DSA
#   ciphers, etc.)
#   Some ECC cipher suites (http://www.ietf.org/rfc/rfc4492.txt)
#   require an ECC certificate which can also be configured in
#   parallel.
SSLCertificateFile "/opt/lampp/etc/ssl.crt/2_www.xxxxx.com.crt"

#   Server Private Key:
#   If the key is not combined with the certificate, use this
#   directive to point at the key file.  Keep in mind that if
#   you've both a RSA and a DSA private key you can configure
#   both in parallel (to also allow the use of DSA ciphers, etc.)
#   ECC keys, when in use, can also be configured in parallel
SSLCertificateKeyFile "/opt/lampp/etc/ssl.key/3_www.xxxxx.com.key"

#   Server Certificate Chain:
#   Point SSLCertificateChainFile at a file containing the
#   concatenation of PEM encoded CA certificates which form the
#   certificate chain for the server certificate. Alternatively
#   the referenced file can be the same as SSLCertificateFile
#   when the CA certificates are directly appended to the server
#   certificate for convenience.
SSLCertificateChainFile "/opt/lampp/etc/1_root_bundle.crt"
```

## 强制跳转到https

```
vi /opt/lampp/etc/httpd.conf
找到
DocumentRoot "/opt/lampp/htdocs"
更正为
DocumentRoot "/opt/lampp/htdocs"

    #
    # Possible values for the Options directive are "None", "All",
    # or any combination of:
    #   Indexes Includes FollowSymLinks SymLinksifOwnerMatch ExecCGI MultiViews
    #
    # Note that "MultiViews" must be named *explicitly* --- "Options All"
    # doesn't give it to you.
    #
    # The Options directive is both complicated and important.  Please see
    # http://httpd.apache.org/docs/trunk/mod/core.html#options
    # for more information.
    #
    #Options Indexes FollowSymLinks
    # XAMPP
    Options Indexes FollowSymLinks ExecCGI Includes

    #
    # AllowOverride controls what directives may be placed in .htaccess files.
    # It can be "All", "None", or any combination of the keywords:
    #   Options FileInfo AuthConfig Limit
    #
    #AllowOverride None
    # since XAMPP 1.4:
    AllowOverride All

    #
    # Controls who can get stuff from this server.
    #
    Require all granted
    #新增内容
    RewriteEngine on
    RewriteCond %{SERVER_PORT} !^443$
    RewriteRule ^(.*)?$ https://%{SERVER_NAME}%{REQUEST_URI} [L,R]
```

到此，如果你的wordpress站点没有配置.htaccess(让你的域名直接指向你的homepage), 你就完成了配置，忽略下面的步骤。如果正确配置的.htaccess，请继续下面内容。

>  正确配置的.htaccess如下：

<!--StartFragment-->

```
# BEGIN WordPress

 RewriteEngine on
 RewriteCond %{HTTP_HOST} ^(www.)?dogooo.cn$
 RewriteCond %{REQUEST_URI} !^/wordpress/
 RewriteCond %{REQUEST_FILENAME} !-f
 RewriteCond %{REQUEST_FILENAME} !-d
 RewriteRule ^(.*)$ /wordpress/$1
 RewriteCond %{HTTP_HOST} ^(www.)?dogooo.cn$
 RewriteRule ^(/)?$ wordpress/index.php [L]

# END WordPress
```

<!--EndFragment-->

## 针对正确配置了的.htaccess，此文件需增加几行代码（注意：新增的内容只能置于最前面）

```
# BEGIN WordPress


 RewriteEngine On
 RewriteBase /
 RewriteCond %{SERVER_PORT} !^443$
 RewriteRule ^.*$ https://%{SERVER_NAME}%{REQUEST_URI} [L,R=301]

 RewriteEngine on
 RewriteCond %{HTTP_HOST} ^(www.)?dogooo.cn$
 RewriteCond %{REQUEST_URI} !^/wordpress/
 RewriteCond %{REQUEST_FILENAME} !-f
 RewriteCond %{REQUEST_FILENAME} !-d
 RewriteRule ^(.*)$ /wordpress/$1
 RewriteCond %{HTTP_HOST} ^(www.)?dogooo.cn$
 RewriteRule ^(/)?$ wordpress/index.php [L]


# END WordPress
```

完成，重启服务器就行sudo /opt/lampp/lampp restart