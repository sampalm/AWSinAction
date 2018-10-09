var AWS = require('aws-sdk');

AWS.config.region = "us-east-1";

var sqs = new AWS.SQS();
var sns = new AWS.SNS();

// Create SQS Queue
var queueUrl;
var params = {
  QueueName: 'samapp-lab', // REQUIRED
  Attributes: {
    ReceiveMessageWaitTimeSeconds: '20',
    VisibilityTimeout: '60'
  }
};

sqs.createQueue(params, function(err, data){
  if (err) console.log(err, err.stack);
  else {
    console.log('Successfully created SQS queue URL '+ data.QueueUrl);
    queueUrl = data.QueueUrl;
    waitingSQS = false;
    //createStaticMessages(data.QueueUrl);
    createMessages(queueUrl);
  }
});

// Pool queue for messages then process and delete
var waitingSQS = false;
var queueCounter = 0;

setInterval(function() {
  if (!waitingSQS) { // Still busy with previous request
    if(queueCounter <= 0) {
      receiveMessages();
    }
    else --queueCounter;
  }
}, 1000);

function createMessages(){
  var message = 'This is a message from Amazon SNS';
  console.log('Sending messages: '+message);
  sns.publish({
    Message: message,
    TargetArn: 'arn:aws:sns:us-east-1:487676984512:samapp-lab'
  }, function (err, data) {
    if (err) console.log(err, err.stack)
    else console.log('Message sent by SNS: '+data);
  })
}

function receiveMessages() {
  var params = {
    QueueUrl: queueUrl, // REQUIRED
    MaxNumberOfMessages: 10,
    VisibilityTimeout: 60,
    WaitTimeSeconds: 20 // Wait for message to arrive
  };
  waitingSQS = true;

  sqs.receiveMessage(params, function(err, data) {
    if (err) {
      waitingSQS = false;
      console.log(err, err.stack);
    } 
    else {
      waitingSQS = false;
      if ((typeof data.Messages !== 'undefined') && (data.Messages.length !== 0)){
        console.log('Received '+ data.Messages.length +' messages from SQS queue.');
        processMessages(data.Messages);
      }
      else {
        queueCounter = 60; // Queue empty wait 60s
        console.log('SQS queue empty, waiting for '+ queueCounter+ 's. ');
      }
    }
  });
}

async function processMessages(messagesSQS) {
  for(const item of messagesSQS) {
    console.log('Processing message: '+item.Body); // Do something with the message
    var params = {
      QueueUrl: queueUrl, // REQUIRED
      ReceiptHandle: item.ReceiptHandle // REQUIRED
    }
    await sqs.deleteMessage(params, function(err, data){
      if (err) console.log(err, err.stakc);
      else {
        console.log('Deleted message RequestID: '+JSON.stringify(data.ResponseMetadata.RequestId)); // successfully deleted
      }
    });
  }
}

async function createStaticMessages(queueUrl) {
  var messages = [];
  for (var i = 0; i < 50; i++) {
    messages[i] = 'This is the content for message '+i+'.';
  }

  //  Asynchronously deliver messages to SQS queue
  for (const item of messages) {
    console.log('Sending message: '+item);
    params = {
      MessageBody: item, // REQUIRED
      QueueUrl: queueUrl // REQUIRED
    };
    await sqs.sendMessage(params, function(err, data) {
      if (err) console.log(err, err.stack)
      else  console.log(data);
    })
  }
}