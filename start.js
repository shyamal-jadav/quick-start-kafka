const readline = require('readline');
var fs = require('fs');
var exec = require('child_process').exec;

console.log("Welcome to Auto KAFKA execution!!!");
console.log("i.e. 'D:\\softwares\\kafka_2.13-2.6.0'")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function readLineAsync(message) {
    return new Promise((resolve, reject) => {
        rl.question(message, (answer) => {
            resolve(answer);
        });
    });
}

async function sh(cmd) {
    return new Promise(function (resolve, reject) {
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
}

async function init() {
    await fs.readFile(process.cwd() + "\\kafkapath.txt", { encoding: 'utf-8' }, async (err, data) => {
        if (!err) {
            var kafkaPath;

            if (data == '') {
                kafkaPath = await readLineAsync("Enter kafka path: ");
                fs.writeFile('kafkapath.txt', kafkaPath, (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Path added successfully");
                    }
                })
            } else {
                kafkaPath = data;
                console.log("Using kafka path as: ", data);
            }

            fs.rmSync(kafkaPath + '/data', { recursive: true, force: true });

            fs.mkdirSync(kafkaPath + '/data');
            fs.mkdirSync(kafkaPath + '/data/kafka');
            fs.mkdirSync(kafkaPath + '/data/zookeeper');

            const zkCommand = 'zookeeper-server-start.bat config\\zookeeper.properties';
            const kafkaCommand = 'kafka-server-start.bat config\\server.properties';

            let zk = sh(`cd ${kafkaPath} && ${zkCommand}`);

            setTimeout(() => {
                console.log("Kafka is ready to use!!!");
            }, 15000);

            let kaf = sh(`cd ${kafkaPath} && ${kafkaCommand}`);

            rl.close();
        } else {
            console.log(err);
        }
    });
}

init();