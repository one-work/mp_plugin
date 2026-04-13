const plugin = requirePlugin('bluetooth')

Page({
  data: {  
    name: 'DP-HT303-5402'
  },

  onLoad() {
    const printers = this.selectComponent('#printers')

    this.printer = new plugin.BluetoothPrinter(wx, this)
    this.printer.registeredDevices = [this.data.name]
    this.setData({
      deviceId: printers.connectedDeviceId,
      name: printers.connectedDeviceName
    })
  },

  selected(e) {
    console.log(e)
    this.setData({
      name: e.detail.name,
      deviceId: e.detail.deviceId
    })
  },

  unselected(e) {
    console.log(e)
  }

})
