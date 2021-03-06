# Get date from a NTP server in WeChat Mini-Program

Based on [wx.createUDPSocket](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/wx.createUDPSocket.html)

![npm bundle size](https://img.shields.io/bundlephobia/minzip/miniprogram-ntp-client)
![Publish to NPM](https://github.com/undirectlookable/miniprogram-ntp-client/workflows/Publish%20to%20NPM/badge.svg)
![License-MIT](https://img.shields.io/npm/l/miniprogram-ntp-client)

## Installation

```bash
npm install --save miniprogram-ntp-client
```

## Example

### Basic

```javascript
const getNTPDate = require('miniprogram-ntp-client');

getNTPDate()
  .then((date) => {
    console.log('server date:', date);
  })
  .catch(console.error);
```

### Optional options

```javascript
const options = {
  server: '0.pool.ntp.org',
  timeout: 3000,
};

getNTPDate(options)
  .then((date) => {
    console.log('server date:', date);
  })
  .catch(console.error);
```
