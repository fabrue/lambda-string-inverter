const awssdk = require('aws-sdk');
const S3 = new awssdk.S3();

const wordsToArray = async (words) => {
   let returnArr = [];
   
    returnArr = words.split('\n').map((word) => {
        if(word) {
            return word;
        }
    })

    return returnArr;
}

const fetchWords = async (bucket, key) => {
    const params = {
        Bucket: bucket,
        Expression: 'SELECT * FROM s3object',
        ExpressionType: 'SQL',
        Key: key,
        InputSerialization: {
            CSV: {
                RecordDelimiter: '\n',
              }
        },
        OutputSerialization: {
            CSV: {
                RecordDelimiter: '\n',
              }
        }
    }

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

const writeFileToS3 = async (body, bucket) => {
    console.log(`body has value: ${body}`);

    // Create a unique filename (since bucket versioning is enablend not necessarily required, but still useful)
    const key = `${new Date().getTime()}-inverted-words.csv`; 

    const params = {
        Body: body.toString(),
        Bucket: bucket,
        Key: key,
    }

    return new Promise((resolve, reject) => {
        S3.putObject(params, (err, data) => {
            if (err) { reject(err); }

            console.log(`putObject data: ${JSON.stringify(data)}`);
            resolve(data);
        })
    })
}

exports.handler = async (event, context) => {
    
    console.log(`Event: ${JSON.stringify(event)}`);

    const bucketname = event.bucketname || process.env.bucketname;
    const key = event.key || process.env.key; // This is the filename where the words are stored - e.g. 'words.csv'

    console.log(`Using env vars: bucketname -> ${bucketname} // key -> ${key}`);

    try{
        const words = await fetchWords(bucketname, key);
        console.log(`Fetched the following words: ${words}`);

        const invertedWords = words.map((word) => invertWord(word));
        console.log(`Inversion result: ${invertedWords}`);

        console.log(`Saving result to S3 now`);
        await writeFileToS3(await wordStringToCsv(invertedWords.toString()), bucketname);

        return `word inversion was successful`
    } catch(e) {
        console.error(`Error: ${e.message}`);
        return `something went wrong`
    }
}