const plugin = requirePlugin('bluetooth')

Page({
  data: {  
    name: 'DP-HT303-5402'
  },

  onLoad() {
    this.printer = new plugin.BluetoothPrinter(wx, this)
    this.printer.registeredDevices = [this.data.name]
  }

})
