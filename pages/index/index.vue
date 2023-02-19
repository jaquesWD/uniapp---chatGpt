<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	
	import { saveList, getList } from '../../services'

	const inputValue = ref('')

	const userMan = ref([])
	
	const edit = ref()

	const buttonShow = ref(false)

	const buttonText = ref('发送')

	const sendData = () => {
		if (!inputValue.value) return
		userMan.value.push({
			type: 'user',
			value: inputValue.value
		})
		buttonText.value = '等待'
		buttonShow.value = true
		uni.showLoading({
			title: '等待回复'
		})
		saveList(userMan.value)
		uni.request({
			url: 'https://api.openai.com/v1/completions',
			method: 'POST',
			header: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer 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'
			},
			data: {
				model: 'text-davinci-003',
				prompt: inputValue.value,
				max_tokens: 2000,
				temperature: 0.5,
				top_p: 1,
				n: 1,
				stream: false,
				logprobs: null,
			},
			success: (res => {
				uni.hideLoading()
				console.log(res)
				if (res.statusCode === 200) {
					userMan.value.push({
						type: 'chat',
						value: res.data.choices[0].text
					})
					saveList(userMan.value)
					buttonShow.value = false
					buttonText.value = '发送'
					inputValue.value = ''
				} else {
					setTimeout(() => {
						uni.showToast({
							title: '发送请求失败请重试'
						})
					}, 1000)
					inputValue.value = ''
				}
			})
		})
	}

	const remove = (index) => {
		uni.showModal({
			title: '有删除弹窗',
			content: '你确定要删除吗',
			success: res => {
				if (res.confirm) {
					userMan.value.splice(index, 1)
					saveList(userMan.value)
					uni.showToast({
						title: '删除成功'
					})
				} else {
					uni.showToast({
						title: '取消删除'
					})
				}
			},
		});
	}

	const removeAll = () => {
		uni.showModal({
			title: '有清空弹窗',
			content: '你确定要清空吗',
			success: res => {
				if (res.confirm) {
					userMan.value = []
					saveList(userMan.value)
					uni.showToast({
						title: '清空成功'
					})
				} else {
					uni.showToast({
						title: '取消清空'
					})
				}
			},
		});
	}

	const copy = (value) => {
		uni.setClipboardData({
			data: value,
		})
	}
	
	onMounted(() => {
		userMan.value = getList()
	})
</script>

<template>
	<view class="content">
		<span class="show-title" v-if='userMan.length < 1'>没有内容请发送信息</span>
		<view class="list">
			<block v-for="(item, index) in userMan" :key="index">
				<view v-if="item.type === 'user'" class="item-right">
					<view>{{item.value}}</view>
					<image src="./static/img_one.jpg" mode="aspectFill"></image>
					<span class="remove-box" @click="remove(index)">x</span>
				</view>
				<view v-else class="item-left">
					<span class="remove-box" @click="remove(index)">x</span>
					<image src="./static/img_two.jpg" mode="aspectFill"></image>
					<view @click="copy(item.value)">{{item.value}}</view>
				</view>
			</block>
		</view>
		<view class="search-box">
			<input v-model="inputValue" @confirm="sendData" placeholder="请输入内容" />
			<button @click="sendData" :disabled="buttonShow">{{ buttonText }}</button>
			<button style="color: red;" @click="removeAll" :disabled="buttonShow">清空</button>
		</view>
	</view>
</template>
<style lang="scss" scoped>
	.content {
		position: relative;
		padding-bottom: 130rpx;
		.show-title {
			position: absolute;
			left: 50%;
			top: 20rpx;
			transform: translate(-50%);
			opacity: 0.5;
		}
		.list {
			width: 710rpx;
			padding: 20rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			
			.remove-box {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 30rpx;
				height: 30rpx;
				border-radius: 50%;
				background-color: #000;
				color: red;
				font-weight: bold;
			}
			

			.item-left {
				display: flex;
				margin-bottom: 20rpx;
				
				image {
					max-height: 88rpx;
					max-width: 88rpx;
					border-radius: 8rpx;
					margin-right: 20rpx;
				}

				view {
					background-color: #fff;
					padding: 10rpx 20rpx;
					font-size: 34rpx;
					color: #333;
					border-radius: 12rpx;
					max-width: 450rpx;
				}
			}

			.item-right {
				display: flex;
				justify-content: flex-end;
				margin-left: 108rpx;
				margin-bottom: 20rpx;
				
				image {
					max-height: 88rpx;
					max-width: 88rpx;
					border-radius: 8rpx;
					margin-left: 20rpx;
				}

				view {
					background-color: #95EC69;
					padding: 10rpx 20rpx;
					font-size: 34rpx;
					color: #333;
					border-radius: 12rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
		}

		.search-box {
			background-color: #f6f6f6;
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			padding: 10rpx;
			display: flex;
			align-items: center;
			border-top: 2rpx solid #ECECEC;

			input {
				background-color: #FEFEFE;
				font-size: 28rpx;
				color: #666;
				padding: 20rpx 10rpx;
				border-radius: 12rpx;
				margin: 0 40rpx;
			}

			button {
				border: none;
				background-color: #E9E9E9;
				font-weight: bold;
				color: #07C160;
				border-radius: 12rpx;
			}

			button:active {
				background-color: #D2D2D2;
			}
		}
	}


	page {
		background-color: #EDEDED;
	}
</style>
