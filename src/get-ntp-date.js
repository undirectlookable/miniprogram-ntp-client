/**
 * Get NTP Date from server
 * @async
 * @param {Object} [options] - Options
 * @param {string} [options.server] - NTP server address
 * @param {number} [options.timeout] - NTP query timeout in ms
 * @return {Promise<Date>} Date from the NTP server
 */
function getNTPDate({
  server = 'time1.cloud.tencent.com',
  timeout = 1000,
} = {}) {
  return new Promise((resolve, reject) => {
    // capability check
    if (typeof wx === 'undefined' || !wx.createUDPSocket) {
      reject(new Error('wx.createUDPSocket is undefined'));
      return;
    }

    // create udp socket
    const udp = wx.createUDPSocket();
    udp.bind();

    // timeout handler
    const timer = setTimeout(() => {
      udp.close();
      reject(new Error('timeout occurred'));
    }, timeout);

    // message listener
    udp.onMessage(({ message }) => {
      udp.close();
      clearTimeout(timer);

      // check messgae
      if (!(message instanceof ArrayBuffer) || message.byteLength !== 48) {
        reject(new Error('message from ntp server is not valid'));
        return;
      }

      // parse message
      const data = new Uint8Array(message);

      const offsetTransmitTime = 40;
      let intpart = 0;
      let fractpart = 0;

      for (let i = 0; i <= 3; i += 1) {
        intpart = 256 * intpart + data[offsetTransmitTime + i];
      }

      for (let i = 4; i <= 7; i += 1) {
        fractpart = 256 * fractpart + data[offsetTransmitTime + i];
      }

      const milliseconds = intpart * 1000 + (fractpart * 1000) / 0x100000000;

      const date = new Date('Jan 01 1900 GMT');
      date.setUTCMilliseconds(date.getUTCMilliseconds() + milliseconds);

      resolve(date);
    });

    udp.onError(reject);

    // send ntp client packet
    const message = new Uint8Array(48);
    message[0] = 0x1b;
    for (let i = 1; i < 48; i += 1) {
      message[i] = 0;
    }

    udp.send({
      address: server,
      port: 123,
      message,
    });
  });
}

module.exports = getNTPDate;
