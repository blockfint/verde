import busInterface from './busInterface';

function handleRequest({ userId, requestId, rpId, data }) {
  console.log(
    'Received new request for userId:',
    userId,
    'with requestId:',
    requestId,
    'from rpId:',
    rpId,
    'with data:',
    data
  );
  //fetch real time? emit web socket?
}

//===== listen to Bus =====
busInterface.listen(handleRequest);

export default busInterface
