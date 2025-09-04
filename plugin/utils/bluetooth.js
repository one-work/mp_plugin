export default class {

  constructor() {
    this.allDevices = []
    this.registeredDevices = []
    this.connectedDevice = {}
  }

  // 获取本机蓝牙适配器状态
  getState({ success, fail, complete } = {}) {
    wx.getBluetoothAdapterState({
      success: stateRes => {
        console.debug('获取本机蓝牙适配器状态', stateRes)
        const state = stateRes.adapterState || stateRes

        if (!state.discovering) {
          this.startBluetoothDevicesDiscovery()
        }

        if (state.available) {
          wx.getBluetoothDevices({
            success: res => {
              console.debug('获取在蓝牙模块生效期间所有搜索到的蓝牙设备', res)
              this.#filterBluetoothDevices(res.devices, success)
              complete?.(this.allDevices)
            }
          })
          wx.onBluetoothDeviceFound(res => {
            console.debug('发现新设备', res)
            this.#filterBluetoothDevices(res.devices, success)
            complete?.(this.allDevices)
          })
        }
      },

      fail: stateRes => {
        console.debug('获取本机蓝牙适配器状态失败', stateRes)
        wx.openBluetoothAdapter({
          success: res => {
            console.debug('初始化蓝牙模块', res)
            this.startBluetoothDevicesDiscovery()
            wx.onBluetoothDeviceFound(res => {
              console.debug('发现新设备', JSON.stringify(res.devices))
              this.#filterBluetoothDevices(res.devices, success)
              complete?.(this.allDevices)
            })
          },
          fail: res => {
            fail?.(res)
            wx.showModal({
              title: '初始化蓝牙模块失败',
              content: '清除缓存后再试'
            })
            console.debug('初始化蓝牙模块失败', res)
          }
        })
      }
    })
  }

  startBluetoothDevicesDiscovery() {
    wx.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: true,
      success: res => {
        console.debug('开始搜寻附近的蓝牙设备', res)
      },
      fail: res => {
        console.debug('搜寻附近的蓝牙设备失败', res)
        this.#reportError('startBluetoothDevicesDiscovery', res)
      }
    })
  }

  #filterBluetoothDevices(devices, success) {
    const foundDevices = this.allDevices

    devices.forEach(device => {
      if (!device.name && !device.localName) { return }
      if (!device.RSSI) { return }
      if (device.name.includes('未知或不支持的设备') || device.name.includes('未知设备')) { return }
      const item = foundDevices.find(e => e.deviceId === device.deviceId)
      if (item) {
        Object.assign(item, device)
      } else {
        console.debug('搜索到新设备', device.name)
        foundDevices.push(device)
      }
    })

    const item = foundDevices.find(e => this.registeredDevices.includes(e.name))
    if (item && this.connectedDevice.deviceId !== item.deviceId) {
      console.debug('可连接设备', item)
      foundDevices.sort((a, b) => {
        if (a.deviceId === item.deviceId) {
          return -1
        } else if (b.deviceId === item.deviceId) {
          return 1
        }

        return 0
      })
      wx.offBluetoothDeviceFound(res => {
        console.debug('停止监听', res)
      })
      wx.stopBluetoothDevicesDiscovery({
        complete(res) {
          console.debug('停止扫描蓝牙设备', res)
        }
      })
      this.createBLEConnection(item.deviceId, success)
    }

    this.allDevices = foundDevices
  }

  #reportError(api, res) {
    wx.request({
      url: 'https://one.work/bluetooth/devices/err',
      method: 'POST',
      header: {
        Accept: 'application/json'
      },
      data: {
        api: api,
        message: res
      }
    })
  }

}
