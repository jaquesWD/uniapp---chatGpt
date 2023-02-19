function saveList (arr) {
	uni.setStorageSync('chatArr', JSON.stringify(arr))
}

function getList() {
	return JSON.parse(uni.getStorageSync('chatArr') || '[]')
}

export {
	saveList,
	getList
}