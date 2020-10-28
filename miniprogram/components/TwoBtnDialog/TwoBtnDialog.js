// components/TwoBtnDialog/TwoBtnDialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '提示'
    },
    buttons: {
      type: Array,
      value: [{text: '取消', type: 'cancel'}, {text: '确定', type: 'confirm'}]
    },
    dialogShow: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击确认
    confirm (e) {
      this.triggerEvent('tapbutton', e.detail.item.type)
    }
  }
})
