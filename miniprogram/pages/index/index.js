const plugin = requirePlugin('bluetooth')

Page({
  onLoad() {
    const printers = this.selectComponent('#printers')
    this.setData({
      deviceId: printers.connectedId,
      deviceName: printers.connectedName
    })

    this.printer = new plugin.BluetoothPrinter(wx, this)
    this.printer.registeredDevices = [this.data.deviceName]
  },

  selected(e) {
    console.log(e)
    this.setData({
      deviceName: e.detail.deviceName,
      deviceId: e.detail.deviceId
    })
  },

  unselected(e) {
    console.log(e)
  }

})
