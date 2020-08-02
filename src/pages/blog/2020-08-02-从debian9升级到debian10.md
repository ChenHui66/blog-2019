---
layout: blog-post
draft: false
date: 2020-08-02T09:55:22.366Z
title: 从debian9升级到debian10
description: >-
  升级到debian10，打开新立得包管理器：Wayland,Synaptic continue without administrative
  privileges...
quote:
  content: >-
    Life doesn't just happen to you; you receive everything in your life based
    on what you've given.
  author: ''
  source: 'http://forums.debian.net/viewtopic.php?f=6&t=142634'
tags:
  - linux
---
solution：
I found the commented text #WaylandEnable=false in /etc/gdm3/daemon.conf which I uncommented and reboot my machine.After reboot,I can access Synaptic Package Manager without errors.