var AWS = require('aws-sdk');

AWS.config.region = 'us-east-1';

var db = new AWS.DynamoDB();
db.listTables(function (err, data) {
  console.log(data.TableNames);
  downloadData();
});

function downloadData() {
  var s3 = new AWS.S3();
  var params = { Bucket: 'lab.samapp.sample', Key: 'lab-data/test-table-items.json' };
  s3.getObject(params, function (error, data) {
    if (error) {
      console.log(error);
    } else {
      var dataJSON = JSON.parse(data.Body);
      console.log(JSON.stringify(dataJSON));
      writeDynamoDB(dataJSON);
    }
  });

  function writeDynamoDB(dataJSON) {
    console.log(JSON.stringify(dataJSON));
    var params = { RequestItems: dataJSON };
    db.batchWriteItem(params, function (err, data) {
      if (err) console.log(err, err.stack);
      else {
        console.log(data);
        queryExpression();
      }
    });
  }

  // Using key condition object
  function queryDynamoDB() {
    var params = {
      TableName: 'test-table', // required
      IndexName: 'ProductCategory-Price-index',
      KeyConditions: {
        "ProductCategory": { // hash
          "AttributeValueList": [{ "S": "Bike" }],
          "ComparisonOperator": "EQ"
        },
        "Price": { // range
          "AttributeValueList": [{ "N": "270" }],
          "ComparisonOperator": "LE"
        }
      }
    };
    db.query(params, function (err, data) {
      if (err) console.log(err, err.stack);
      else console.log(data.Items);
    });
  }

  // Using key condition expression 
  function queryExpression() {
    var params = {
      TableName: 'test-table', // required
      IndexName: 'ProductCategory-Price-index',
      KeyConditionExpression: "ProductCategory = :prod_cat AND Price <= :price",
      ExpressionAttributeValues: {
        ":prod_cat": { "S": "Bike" },
        ":price": { "N": "250" }
      }
    };
    db.query(params, function (err, data) {
      if (err) console.log(err, err.stack);
      else console.log(data.Items);
    });
  }

};