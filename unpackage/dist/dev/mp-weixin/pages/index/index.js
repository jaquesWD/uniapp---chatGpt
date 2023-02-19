"use strict";
const common_vendor = require("../../common/vendor.js");
const services_index = require("../../services/index.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const inputValue = common_vendor.ref("");
    const userMan = common_vendor.ref([]);
    common_vendor.ref();
    const buttonShow = common_vendor.ref(false);
    const buttonText = common_vendor.ref("发送");
    const sendData = () => {
      if (!inputValue.value)
        return;
      userMan.value.push({
        type: "user",
        value: inputValue.value
      });
      buttonText.value = "等待";
      buttonShow.value = true;
      common_vendor.index.showLoading({
        title: "等待回复"
      });
      services_index.saveList(userMan.value);
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
            services_index.saveList(userMan.value);
            buttonShow.value = false;
            buttonText.value = "发送";
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
    const remove = (index) => {
      common_vendor.index.showModal({
        title: "有删除弹窗",
        content: "你确定要删除吗",
        success: (res) => {
          if (res.confirm) {
            userMan.value.splice(index, 1);
            services_index.saveList(userMan.value);
            common_vendor.index.showToast({
              title: "删除成功"
            });
          } else {
            common_vendor.index.showToast({
              title: "取消删除"
            });
          }
        }
      });
    };
    const removeAll = () => {
      common_vendor.index.showModal({
        title: "有清空弹窗",
        content: "你确定要清空吗",
        success: (res) => {
          if (res.confirm) {
            userMan.value = [];
            services_index.saveList(userMan.value);
            common_vendor.index.showToast({
              title: "清空成功"
            });
          } else {
            common_vendor.index.showToast({
              title: "取消清空"
            });
          }
        }
      });
    };
    const copy = (value) => {
      common_vendor.index.setClipboardData({
        data: value
      });
    };
    common_vendor.onMounted(() => {
      userMan.value = services_index.getList();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: userMan.value.length < 1
      }, userMan.value.length < 1 ? {} : {}, {
        b: common_vendor.f(userMan.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.type === "user"
          }, item.type === "user" ? {
            b: common_vendor.t(item.value),
            c: common_vendor.o(($event) => remove(index), index)
          } : {
            d: common_vendor.o(($event) => remove(index), index),
            e: common_vendor.t(item.value),
            f: common_vendor.o(($event) => copy(item.value), index)
          }, {
            g: index
          });
        }),
        c: common_vendor.o(sendData),
        d: inputValue.value,
        e: common_vendor.o(($event) => inputValue.value = $event.detail.value),
        f: common_vendor.t(buttonText.value),
        g: common_vendor.o(sendData),
        h: buttonShow.value,
        i: common_vendor.o(removeAll),
        j: buttonShow.value
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"], ["__file", "E:/chatgpt/chatUniapp/chatGpt/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
