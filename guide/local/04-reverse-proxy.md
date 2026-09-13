# 4. 反向代理与 HTTPS

默认通过 `http://服务器IP:3000` 提供内网访问。需要域名或 HTTPS 时，在服务器上配置反向代理，把流量转发到 `3000` 端口。

::: tip 只在需要时做
只在教室内网使用时，直接访问 `http://内网IP:3000` 就够了，不必配置本篇内容。教室大屏建议收藏这个地址。
:::

## 为什么需要反向代理

| 需求 | 直接访问 3000 端口 | 反向代理 |
| --- | --- | --- |
| 内网访问 | ✅ 可以 | ✅ 可以 |
| 使用域名而不是 IP | ❌ | ✅ |
| HTTPS 加密 | ❌ | ✅ |
| 公网访问 | 需要直接暴露端口，不推荐 | ✅ |
| 80/443 标准端口 | ❌ | ✅ |

## 关键要求

- 使用 Nginx、Caddy 或服务器上已有的反向代理服务；
- **必须转发 `X-Forwarded-Host` 与 `X-Forwarded-Proto`**，项目的同源与 CORS 校验依赖这两个头，配置不当可能出现接口被拒绝；
- 启用 HTTPS（例如 Let's Encrypt 证书），并把公网 443/80 端口转发到反向代理。

## Nginx 示例

```nginx
server {
  listen 443 ssl;
  server_name novora.example.com;
  ssl_certificate     /etc/letsencrypt/live/novora.example.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/novora.example.com/privkey.pem;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

## Caddy 示例

Caddy 一行即可，并自动申请与续期 HTTPS 证书：

```text
novora.example.com {
    reverse_proxy 127.0.0.1:3000
}
```

## DNS 解析

把 `novora.example.com` 解析到反向代理所在机器的公网 IP。如果服务器只有内网 IP，需要在路由器或防火墙上做端口转发：

```text
公网 443 → 反向代理 443
公网 80  → 反向代理 80（用于证书签发与跳转）
```

## 访问并验证

配置完成后：

1. 浏览器打开 `https://novora.example.com`；
2. 确认地址栏显示 HTTPS 正常，没有证书警告；
3. 访问 `https://novora.example.com/api/time`，应返回 JSON 而不是 404；
4. 登录后台并保存一次数据，确认接口没有被拒绝。

## 接口被拒绝时

优先检查三项：

1. 反向代理是否转发了 `X-Forwarded-Host` 与 `X-Forwarded-Proto`；
2. `Host` 头是否保持为你的域名，而不是被改写成 `127.0.0.1`；
3. 域名是否与浏览器实际访问的地址完全一致（含端口和协议）。

## 下一步

代理配置完成后进入[初始化与验收](/guide/local/05-acceptance)。
