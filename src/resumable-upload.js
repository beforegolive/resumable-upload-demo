import React from 'react'

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
			form.append('file', new File([reader.result], uploadedFile.name, { type: 'text/plain' }))
			fetch('http://localhost:3000/post-test', {
				method: 'POST',
				headers: {
					Accept: 'application/json'
				},
				body: form
			})
				.then(res => {
					return res.blob()
				})
				.then(response => {
					console.warn('response:', response)
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
				Resumable Upload Component
				<input ref={file => (this._file = file)} type="file" onChange={this.changeHandler} />
				{/* <button onClick={this.uploadFile}>上传文件</button> */}
			</div>
		)
	}
}

export default ResumableUpload
