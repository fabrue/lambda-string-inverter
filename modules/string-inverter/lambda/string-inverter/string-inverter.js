const awssdk = require('aws-sdk');
const S3 = new awssdk.S3();

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

const wordsToArray = async (words) => {
   let returnArr = [];
   
   const extractWord = (input) => {
       // Input row's structure is { "_1":"word"}, this function extracts the word
       return JSON.parse(input)._1;
   }

    returnArr = words.split(',').map((word) => {
        if(word) {
            return extractWord(word);
        }
    })

    return returnArr;
}

const fetchWords = async (params) => {
    if (!params) { throw new Error('No params provided'); }

    return new Promise((resolve, reject) => {
        S3.selectObjectContent(params, (err, data) => {
            if (err) { reject(err); }

            let words = [];

            data.Payload.on('data', (event) => {
                if(event.Records) { words.push(event.Records.Payload); }
            })
            .on('error', (err) => {
                reject(err);
            })
            .on('end', (event) => {
                resolve(wordsToArray(Buffer.concat(words).toString()));
            })
        });
    })
}

const invertWord = (word) => {
    let invertedWord = '';

    if(word) {
        invertedWord = Array.from(word).reduceRight((val, acc) => val + acc);
    }
    console.log(`Inverted ${word} to ${invertWord}`);
    return invertedWord;
}

const wordStringToCsv = async (wordString) => {
    return wordString.replace(/,/g, '\n');
}

const writeFileToS3 = async (body) => {
    console.log(`body has value: ${body}`);

    // Create a unique filename (since bucket versioning is enablend not necessarily required, but still useful)
    const key = `${new Date().getTime()}-inverted-words.csv`; 

    const params = {
        Body: body.toString(),
        Bucket: 'dd-challenge-application-storage',
        Key: key,
    }

    return new Promise((resolve, reject) => {
        S3.putObject(params, (err, data) => {
            if (err) { reject(err); }

            console.log(`putObject data: ${data}`);
            resolve(data);
        })
    })
}

exports.handler = async (event, context) => {
    console.log(`string inverter`);

    try{
        const words = await fetchWords(params);
        console.log(`Fetched the following words: ${words}`);

        const invertedWords = words.map((word) => invertWord(word));
        console.log(`Inversion result: ${invertedWords}`);

        console.log(`Saving result to S3 now`);
        await writeFileToS3(await wordStringToCsv(invertedWords.toString()));

    } catch(e) {
        console.error(`Error: ${e.message}`);
    }
}