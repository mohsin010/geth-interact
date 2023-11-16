const Web3 = require('web3');

const providerUrl = 'http://127.0.0.1:30314'; //ws 8557, http 30314
const web31 = new Web3(providerUrl);

const ipcPath = '../geth/node2/geth.ipc';
const net = require('net');
// const web3 = new Web3(ipcPath, net);

const senderAddress = '';
const senderPassphrase = 'node2';

//Get txpool
// const subscription = web3.eth.subscribe("pendingTransactions", (err, result)=>{
//     if(err){
//         console.log(err)
//     }else{
//         return result;
//     }
// });

// function getPendingTransactions(){
//     subscription.on("data", async(txH)=>{
//         let tx  = await web3.eth.getTransaction(txH);
//         console.log(tx);
//     })
// }

// unlock sender account
async function unlockAccount(){
    try{
        await web31.eth.personal.unlockAccount(senderAddress, senderPassphrase, 300);
        console.log('Sender account unlocked successfully');
    } catch (e){
        console.log('Error while unlocking account:', e);
    }
}

const recipientAddress = '';

async function getGasSuggesstion(web3, tx){
    const header = await web3.eth.getBlock('latest');
    //console.log(header); return;
    const baseFee = web3.utils.fromWei(web3.utils.toBN(header.baseFeePerGas), "gwei");

    const gasLimit = await web3.eth.estimateGas(tx);

    const priorityFee = await web3.eth.maxPriorityFeePerGas();
    // const totalFee = gasLimit * ( baseFee + priorityFee);
    const gasPrice = await web3.eth.getGasPrice()
    const fee = {
        baseFee: baseFee,
        priorityFee: priorityFee,
        gasLimit: gasLimit,
        gasPrice: gasPrice,
        // totalFee: totalFee
    }
    console.log(fee);
    return;
}
// Send transaciton
async function sendTransaction() {
    try{
        const txObject = {
            from: senderAddress,
            to: recipientAddress,
            value: web31.utils.toWei('10000', 'Gwei'),
            // nonce: "0xf5",
            gasPrice: "3000"
            //web3.utils.toWei('1000', 'Wei') //The problem was queued transactios, now again run the whole scenerio with setting miners gas price and setting gas price from here more then or equal to the miners
        };

        const transacitonHash = await web31.eth.sendTransaction(txObject);
        // web3.eth.personal.lockAccount(senderAddress);
        // getGasSuggesstion(web31, txObject);
        // return;
        console.log('Transaction details:', transacitonHash);
        return;
    }catch(e){
        console.log('Error in transaction:', e);
    }
}

async function getDeployedContracts(){
    try{
        const latestBlock = await web3.eth.getBlock('latest');
        const transactionCount = latestBlock.transactions.length;
        console.log("Number of deployed contracts:", latestBlock);
    } catch(e){
        console.log("Error in Transaction:", e)
    }
}

// getDeployedContracts();
setInterval(() => {
    unlockAccount().then(sendTransaction).catch(console.error);
    console.log('Waiting..............')
    // sendTransaction()
    // getPendingTransactions();
}, 12000);