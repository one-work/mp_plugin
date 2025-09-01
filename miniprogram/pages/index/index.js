const plugin = requirePlugin('bluetooth')

Page({
  data: {
    items: [],
    currentItem: 0
  },

  onLoad() {
    this.xx = new plugin.BluetoothPrinter()
  }

})
