import React from 'react'
import md5 from 'js-md5'
class ResumableUpload extends React.Component {
	uploadFile = () => {
		// console.warn(this._file.files)
		// fetch()
	}

	componentDidMount() {
		if (window.File && window.FileReader && window.FileList && window.Blob) {
			// Great success! All the File APIs are supported.
		} else {
			alert('The File APIs are not fully supported in this browser.')
		}
	}

	changeHandler = e => {
		console.warn('=== e:', e.target.files)
		const uploadedFile = e.target.files[0]
		let form = new FormData()
		var reader = new FileReader()

		reader.onload = e => {
			console.warn('== onload')
		}

		reader.onloadend = e => {
			console.warn('== onloadend')
			console.warn('=== reader:', reader)
			console.warn('=== result md5: ', md5(reader.result))
			const fileMd5 = md5(reader.result)
			const ext = uploadedFile.name.substr(uploadedFile.name.lastIndexOf('.') + 1)
			const finalFileName = `${fileMd5}.${ext}`
			form.append('file', new File([reader.result], finalFileName, { type: 'text/plain' }))
			fetch('http://localhost:3000/post-test', {
				method: 'POST',
				headers: {
					Accept: 'application/json'
				},
				body: form
			}).then(res => {
				return res.blob()
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
