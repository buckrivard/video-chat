let clientWS;

const sendJSON = (object) => {
  clientWS.send(JSON.stringify(object));
};

const initWebsocket = async () => {
  return new Promise((res, rej) => {
    if (clientWS) return res();
    
    clientWS = new WebSocket('ws:localhost:8080/ws');
  
    clientWS.onopen = () => {
      res();
    }
  });

};



const init = async () => {
  await initWebsocket();
};

init();




