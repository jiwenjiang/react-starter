export const convertBase64ToBlob = (code) => {
    let bytes = window.atob(code.split(',')[1]);
    let ab = new ArrayBuffer(bytes.length);
    let ia = new Uint8Array(ab);
    for(let i = 0; i < bytes.length; i++){
        ia[i] = bytes.charCodeAt(i);
    }
    return new Blob([ab], {type: 'image/png'});
};

// export const snapImage = (video, canvas, mediaStreamTrack) => {
//     video = this.refs.video;
//     // canvas = this.refs.canvas;
//     let getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
//     if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
//         navigator.mediaDevices.getUserMedia({
//             video: true
//         }).then(stream => {
//             mediaStreamTrack = typeof stream.stop === 'function' ? stream : stream.getTracks()[0];
//             video.src = (window.URL || window.webkitURL).createObjectURL(stream);
//             video.play();
//         }).catch(err => {console.log(err)})
//     }
//     else if(getMedia){
//         navigator.getMedia({
//             video: true
//         }, (stream) => {
//             mediaStreamTrack = stream.getTracks()[0];
//             video.src = (window.URL || window.webkitURL).createObjectURL(stream);
//             video.play();
//         }, (err) => {console.log(err)});
//     }
//     this.setState({snapVisible: true})
// };