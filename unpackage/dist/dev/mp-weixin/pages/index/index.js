"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const inputValue = common_vendor.ref("");
    const userMan = common_vendor.ref([]);
    common_vendor.ref();
    const sendData = () => {
      userMan.value.push({
        type: "user",
        value: inputValue.value
      });
      common_vendor.index.showLoading({
        title: "等待回复"
      });
      common_vendor.index.request({
        url: "https://api.openai.com/v1/completions",
        method: "POST",
        header: {
          "Content-Type": "application/json",
          "Authorization": "Bearer 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"
        },
        data: {
          model: "text-davinci-003",
          prompt: inputValue.value,
          max_tokens: 2e3,
          temperature: 0.5,
          top_p: 1,
          n: 1,
          stream: false,
          logprobs: null
        },
        success: (res) => {
          common_vendor.index.hideLoading();
          console.log(res);
          if (res.statusCode === 200) {
            userMan.value.push({
              type: "chat",
              value: res.data.choices[0].text
            });
            inputValue.value = "";
          } else {
            setTimeout(() => {
              common_vendor.index.showToast({
                title: "发送请求失败请重试"
              });
            }, 1e3);
            inputValue.value = "";
          }
        }
      });
    };
    const copy = (value) => {
      common_vendor.index.setClipboardData({
        data: value
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(userMan.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.type === "user"
          }, item.type === "user" ? {
            b: common_vendor.t(item.value)
          } : {
            c: common_vendor.t(item.value),
            d: common_vendor.o(($event) => copy(item.value), index)
          }, {
            e: index
          });
        }),
        b: common_vendor.o(sendData),
        c: inputValue.value,
        d: common_vendor.o(($event) => inputValue.value = $event.detail.value),
        e: common_vendor.o(sendData)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"], ["__file", "E:/chatgpt/chatUniapp/chatGpt/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
