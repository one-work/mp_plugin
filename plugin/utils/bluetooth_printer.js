import Bluetooth from './bluetooth'

export default class extends Bluetooth {

  // 向蓝牙设备发送数据
  writeValue(data, maxChunk = 20) {
    while (data.length > 0) {
      let subData = data.splice(0, maxChunk)
      let buffer = new ArrayBuffer(subData.length)
      let uint = new Uint8Array(buffer)
      uint.set(subData)

      wx.writeBLECharacteristicValue({
        deviceId: this.printer.deviceId,
        serviceId: this.printer.serviceId,
        characteristicId: this.printer.characteristicId,
        value: buffer,
        writeType: 'write',
        success(res) {
          console.debug('写入数据成功', res.errMsg)
        },
        fail(res) {
          console.debug('写入数据失败', res)
        }
      })
    }
  }

  #createBLEConnection(deviceId, success) {
    wx.createBLEConnection({
      deviceId,
      success: res => {
        console.debug('连接蓝牙设备', deviceId, res)

        // 获取蓝牙设备的所有服务
        wx.getBLEDeviceServices({
          deviceId,
          success: res => {
            const servicesLength = res.services.length
            res.services.forEach((service, index) => {
              if (service.isPrimary) {
                console.debug('设备 ID：', deviceId, '主服务：', service.uuid)
                // 获取蓝牙设备服务中所有特征
                wx.getBLEDeviceCharacteristics({
                  deviceId: deviceId,
                  serviceId: service.uuid,
                  success: res => {
                    for (const characteristic of res.characteristics) {
                      if (characteristic.properties.write && characteristic.properties.writeNoResponse) {
                        console.debug('可写入', deviceId, service.uuid, characteristic.uuid)
                        this.printer = {
                          deviceId: deviceId,
                          serviceId: service.uuid,
                          characteristicId: characteristic.uuid
                        }
                      }
                    }
                    // 所有 service 的特制值已获取完毕
                    if (servicesLength === index + 1) {
                      success?.({ devices: this.allDevices })
                    }
                  },
                  fail: res => {
                    console.error('读取蓝牙设备特征值失败', res)
                  }
                })
              }
            })
          }
        })
      },
      fail: res => {
        console.debug('连接蓝牙设备失败', res)
      }
    })
  }
}