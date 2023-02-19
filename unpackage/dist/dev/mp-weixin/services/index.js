"use strict";
const common_vendor = require("../common/vendor.js");
function saveList(arr) {
  common_vendor.index.setStorageSync("chatArr", JSON.stringify(arr));
}
function getList() {
  return JSON.parse(common_vendor.index.getStorageSync("chatArr") || "[]");
}
exports.getList = getList;
exports.saveList = saveList;
