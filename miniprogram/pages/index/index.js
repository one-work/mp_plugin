const plugin = requirePlugin('bluetooth')

Page({
  data: {  
    name: 'DP-HT303-5402'
  },

  onLoad() {
    this.printer = new plugin.BluetoothPrinter(wx, this)
    this.printer.registeredDevices = [this.data.name]
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
