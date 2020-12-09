let rtcPeerConnection;
let initiatedConnection = false;

const setPeerConnection = async () => {
  if (rtcPeerConnection) return rtcPeerConnection;

  rtcPeerConnection = new RTCPeerConnection();
}

const initWebcam = () => {
  
};

const initiateConnection = async () => {

  await initWebsocket();

  initiatedConnection = true;

  setPeerConnection();

  await initWebcam();

  const offer = await rtcPeerConnection.createOffer();

  rtcPeerConnection.setLocalDescription(offer);

  clientWS.onmessage = msg => {
    const { data } = msg;
    const remoteDesc = JSON.parse(data);
    const { answer } = remoteDesc;
    rtcPeerConnection.setRemoteDescription(answer);
  }

  sendJSON({offer});
};


const receiveConnection = async () => {
  if (initiatedConnection) return;

  await initWebsocket();

  setPeerConnection();

  clientWS.onmessage = async ({ data }) => {
    const remoteDesc = JSON.parse(data);
    const { offer } = remoteDesc;

    rtcPeerConnection.setRemoteDescription(offer);
    const answer = await rtcPeerConnection.createAnswer();
    await rtcPeerConnection.setLocalDescription(answer);
    sendJSON({answer});
  }

};

receiveConnection();
