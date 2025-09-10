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
  },

  printPos() {
    const pos = new plugin.PrintPOS()
    pos.text_big('创印智能 RRRRRRR')
    const data = pos.render()
    console.debug('处理后的数据：', data)

    this.printer.getState({
      success: (res) => {
        this.printer.writeValue(data)
      }
    })
  }

})
