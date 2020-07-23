import React, { useEffect, useState } from 'react'
import md5 from 'js-md5'
import axios from 'axios'

import './index.css'

const serverUrl = `http://192.168.220.1:8081`

function ResumableUpload() {
	const [progress, setProgress] = useState(0)
	const [isUploading, setIsUploading] = useState(false)
	const [isFinished, setIsFinished] = useState(false)
	const [getResult, setGetResult] = useState('')

	const CancelToken = axios.CancelToken
	let cancel
	useEffect(() => {
		if (window.File && window.FileReader && window.FileList && window.Blob) {
		} else {
			alert('The File APIs are not fully supported in this browser.')
		}
	})

	const changeHandler = e => {
		const uploadedFile = e.target.files[0]
		let form = new FormData()
		var reader = new FileReader()

		reader.onloadend = async e => {
			const fileMd5 = md5(reader.result)
			const ext = uploadedFile.name.substr(uploadedFile.name.lastIndexOf('.') + 1)
			const finalFileName = `${fileMd5}.${ext}`

			// 获取上一次上传但未完成的的文件大小
			const previousUploadedFileSize = await fetch(
				`${serverUrl}/get-tmp-file-size?name=${finalFileName}`
			).then(res => res.json())

			const previouProgress = Math.floor(
				previousUploadedFileSize.size / uploadedFile.size * 100
			)
			setProgress(previouProgress)

			// 根据上次上传的文件大小来进行切片续传
			const partFile =
				previousUploadedFileSize.size === 0
					? reader.result
					: reader.result.slice(previousUploadedFileSize.size)

			form.append(
				uploadedFile.name,
				new File([partFile], finalFileName, { type: 'text/plain' })
			)

			axios({
				method: 'POST',
				url: `${serverUrl}/upload-file-test`,
				data: form,
				onUploadProgress: progressEvent => {
					// 用当前上传部分加上上次上传的部分来正确显示进度条位置
					const uploadedPart = progressEvent.loaded + previousUploadedFileSize.size
					const wholeFileSize = uploadedFile.size
					const currProgress = Math.floor(uploadedPart / wholeFileSize * 100)
					setProgress(currProgress)
					if (currProgress === 100) {
						setIsFinished(true)
						setIsUploading(false)
					}
				},
				cancelToken: new CancelToken(function executor(c) {
					cancel = c
				})
			})
		}

		setIsUploading(true)
		setIsFinished(false)
		reader.readAsArrayBuffer(uploadedFile)
	}

	// 确保上传同一个文件时也能触发onChange事件
	const clearSelectedFile = e => {
		e.target.value = null
	}

	// 此方法未达预期，只能在文件还未开始传输前有效，一旦开始传输则无法取消
	const stopUploading = () => {
		cancel()
	}

	const handleAlertBtn = () => {
		alert(123)
	}

	const sendGetRequest = () => {
		axios
			.get(`${serverUrl}/`)
			.then(json => {
				console.log(json)
				setGetResult(JSON.stringify(json))
			})
			.catch(err => {
				setGetResult(JSON.stringify(err))
			})
	}

	const redirectToAuth = () => {
		axios.get(getResult).then(() => {
			setGetResult('认证成功')
			setTimeout(() => {
				window.close()
			}, 3000)
		})
		// location.href = getResult
	}
	const getAuthActionUrl = () => {
		const authAction = location.href.split('authaction=')[1]
		setGetResult(authAction)
	}

	return (
		<div className="container">
			<h4>断点续传的demo演示</h4>
			<div className="subtitle">请确保后端server已启动，具体方法参考项目readme文件</div>
			<input type="file" onChange={changeHandler} onClick={clearSelectedFile} />
			<div className="progressBar">
				<div className="highLight" style={{ width: `${progress}%` }} />
				<div className="baseBar" />
				<div className="text">{progress}%</div>
			</div>
			{isUploading && <div className="uploading">上传中，可刷新页面停止上传（待完善）</div>}
			{isFinished && <div className="finished">上传成功！</div>}
			<div className="tip">请使用chrome浏览器的网络限速功能来更好的测试断点续传</div>
			<div>下面部分是跟另外一个demo相关：captive portal，请忽略。</div>
			<div>当前地址：{location.href}</div>
			<div>location.search: {location.search}</div>
			<div>浏览器：{window.navigator.userAgent}</div>
			<br />
			<div>
				<button onClick={handleAlertBtn}>Try alert</button>
			</div>
			<br />
			<div>
				<button onClick={sendGetRequest}>Send get request</button>
			</div>
			<div>
				<form method="get" action={`${serverUrl}/`}>
					<button type="submit">form 提交 get 方法</button>
				</form>
			</div>

			<br />
			<div>
				<button onClick={getAuthActionUrl}>获取认证地址</button>
			</div>
			<br />
			<div>
				<button onClick={redirectToAuth}>链接认证</button>
			</div>
			<form method="get" action={getResult}>
				<button type="submit">表单认证</button>
			</form>
			<div>
				<div>result: </div>
				<div>{getResult}</div>
			</div>
		</div>
	)
}

export default ResumableUpload
