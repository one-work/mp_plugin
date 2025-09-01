const plugin = requirePlugin('bluetooth')

Page({
  data: {
    items: [],
    currentItem: 0
  },
  onLoad() {
    this.xx = new plugin.Bluetooth()
  },
  addItem() {
    this.data.items.push(this.data.currentItem++)
    this.setData({
      items: this.data.items,
      currentItem: this.data.currentItem
    })
  }
})
