import React, { useEffect, useState } from 'react'
import md5 from 'js-md5'
import axios from 'axios'

import './index.css'

function ResumableUpload() {
	const [progress, setProgress] = useState(0)

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
				`http://localhost:3000/get-tmp-file-size?name=${finalFileName}`
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

			form.append('file', new File([partFile], finalFileName, { type: 'text/plain' }))

			axios.post('http://localhost:3000/post-test', form, {
				onUploadProgress: progressEvent => {
					// 用当前上传部分加上上次上传的部分来正确显示进度条位置
					const uploadedPart = progressEvent.loaded + previousUploadedFileSize.size
					const wholeFileSize = uploadedFile.size
					const currProgress = Math.floor(uploadedPart / wholeFileSize * 100)
					setProgress(currProgress)
				}
			})
		}

		reader.readAsArrayBuffer(uploadedFile)
	}

	return (
		<div className="container">
			<h4>Resumable Upload Component</h4>
			<input type="file" onChange={changeHandler} />

			<div className="progressBar">
				<div className="highLight" style={{ width: `${progress}%` }} />
				<div className="baseBar" />
				<div className="text">{progress}%</div>
			</div>
		</div>
	)
}

export default ResumableUpload
