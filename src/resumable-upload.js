import React from 'react'

class ResumableUpload extends React.Component {
	uploadFile = () => {
		// console.warn(this._file.files)
		// fetch()
	}

	changeHandler = e => {
		console.warn('=== e:', e.target.files)
		// let form = new FormData()
		// form.append('file', new Blob[e.target.files[0]]())
		fetch('http://localhost:3000/post-test', {
			method: 'POST',
			headers: {
				Accept: 'application/json, application/xml, text/plain, text/html, *.*',
				'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>'
			},
			body: e.target.files[0]
		}).then(res => {
			console.warn('res:', res)
			return res.blob()
		})
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
