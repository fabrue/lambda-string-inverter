const AWS = require('aws-sdk');
const S3 = new AWS.S3();

const params = {
    Bucket: 'dd-challenge-application-storage',
    Expression: 'SELECT * FROM s3object',
    ExpressionType: 'SQL',
    InputSerialization: {
        JSON: {
            Type: 'DOCUMENT',
          }
    },
    Key: 'words.csv',
    OutputSerialization: {
        JSON: {
            RecordDelimiter: ','
          }
    }
}

const fetchStrings = async () => {
    return new Promise((resolve, reject) => {
        S3.selectObject
    })
}

exports.handler = async (_, context) => {
    console.log(`string inverter`);

    try{

    } catch(e) {

    }
}