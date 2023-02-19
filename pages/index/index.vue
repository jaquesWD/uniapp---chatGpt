<script setup>
	import {
		ref,
		onMounted
	} from 'vue'

	const inputValue = ref('')

	const userMan = ref([])

	const edit = ref()

	const sendData = () => {
		userMan.value.push({
			type: 'user',
			value: inputValue.value
		})
		uni.showLoading({
			title: '等待回复'
		})
		uni.request({
			url: 'https://api.openai.com/v1/completions',
			method:'POST',
			header:{
				'Content-Type': 'application/json',
				'Authorization':'Bearer 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'
			},
			data:{
				model:'text-davinci-003',
				prompt:inputValue.value,
				max_tokens: 2000,
				temperature:0.5,
				top_p: 1,
				n: 1,
				stream: false,
				logprobs: null,
			},
			success:(res => {
				uni.hideLoading()
				console.log(res)
				if (res.statusCode === 200) {
					userMan.value.push({
						type: 'chat',
						value: res.data.choices[0].text
					})
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
	
	const copy = (value) => {
		uni.setClipboardData({
			data: value,
		})
	}
	
</script>

<template>
	<view class="content">
		<view class="list">
			<block v-for="(item, index) in userMan" :key="index">
				<view v-if="item.type === 'user'" class="item-right">
					<view>{{item.value}}</view>
					<image src="./static/img_one.jpg" mode="aspectFill"></image>
				</view>
				<view v-else class="item-left">
					<image src="./static/img_two.jpg" mode="aspectFill"></image>
					<view @click="copy(item.value)">{{item.value}}</view>
				</view>
			</block>
		</view>
		<view class="search-box">
			<input v-model="inputValue" @confirm="sendData"/>
			<view @click="sendData">发送</view>
		</view>
	</view>
</template>
<style lang="scss" scoped>
.list{
		width: 710rpx;
		padding: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.item-left{
			display: flex;
			margin-bottom: 20rpx;
			image{
				max-height: 88rpx;
				max-width: 88rpx;
				border-radius: 8rpx;
				margin-right: 20rpx;
			}
			view{
				background-color: #fff;
				padding: 10rpx 20rpx;
				font-size: 34rpx;
				color: #333;
				border-radius: 12rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				max-width: 450rpx;
			}
		}
		.item-right{
			display: flex;
			justify-content: flex-end;
			margin-left: 108rpx;
			margin-bottom: 20rpx;
			image{
				max-height: 88rpx;
				max-width: 88rpx;
				border-radius: 8rpx;
				margin-left: 20rpx;
			}
			view{
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
	.search-box{
		background-color: #f6f6f6;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		padding-bottom: 30rpx;
		display: flex;
		align-items: center;
		border-top: 2rpx solid #ECECEC;
		padding-top: 20rpx;
		input{
			width: 450rpx;
			background-color: #FEFEFE;
			font-size: 28rpx;
			color: #666;
			padding: 20rpx 10rpx;
			border-radius: 12rpx;
			margin: 0 40rpx;
		}
		view{
			background-color: #E9E9E9;
			font-size: 32rpx;
			font-weight: bold;
			padding: 14rpx 60rpx;
			color: #07C160;
			border-radius: 12rpx;
		}
		view:active{
			background-color: #D2D2D2;
		}
	}
	
	page{
		background-color: #EDEDED;
	}
</style>