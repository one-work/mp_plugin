const plugin = requirePlugin('bluetooth')

Page({
  data: {
    items: [],
    currentItem: 0
  },

  onLoad() {
    this.plugin = plugin
    this.printer = new plugin.BluetoothPrinter(wx)
    this.printer.registeredDevices = ['DP-HT303-5402']
  }

})
