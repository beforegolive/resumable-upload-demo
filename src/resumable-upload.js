import React from 'react'
import md5 from 'js-md5'
class ResumableUpload extends React.Component {
	uploadFile = () => {
		// console.warn(this._file.files)
		// fetch()
	}

	componentDidMount() {
		if (window.File && window.FileReader && window.FileList && window.Blob) {
		} else {
			alert('The File APIs are not fully supported in this browser.')
		}
	}

	changeHandler = e => {
		const uploadedFile = e.target.files[0]
		let form = new FormData()
		var reader = new FileReader()

		reader.onload = e => {
			console.warn('== onload')
		}

		reader.onloadend = async e => {
			console.warn('=== result md5: ', md5(reader.result))
			const fileMd5 = md5(reader.result)
			const ext = uploadedFile.name.substr(uploadedFile.name.lastIndexOf('.') + 1)
			const finalFileName = `${fileMd5}.${ext}`

			// 获取上一次上传但未完成的的文件大小
			const previousUploadedFileSize = await fetch(
				`http://localhost:3000/get-tmp-file-size?name=${finalFileName}`
			).then(res => res.json())

			// 看情况选择是否将文件切片
			const partFile =
				previousUploadedFileSize.size === 0
					? reader.result
					: reader.result.slice(previousUploadedFileSize.size)

			form.append('file', new File([partFile], finalFileName, { type: 'text/plain' }))

			fetch('http://localhost:3000/post-test', {
				method: 'POST',
				headers: {
					Accept: 'application/json'
				},
				body: form
			})
		}

		reader.onloadstart = e => {
			console.warn('== onloadstart')
		}

		reader.onprogress = e => {
			if (e.lengthComputable) {
				var percentLoaded = Math.round(e.loaded / e.total * 100)
				console.warn(`total:${e.total}, loaded:${e.loaded}, percent:${percentLoaded}%`)
			}
		}

		reader.readAsArrayBuffer(uploadedFile)
	}

	render() {
		return (
			<div>
				<h4>Resumable Upload Component</h4>
				<input ref={file => (this._file = file)} type="file" onChange={this.changeHandler} />
				{/* <button onClick={this.uploadFile}>上传文件</button> */}
			</div>
		)
	}
}

export default ResumableUpload
