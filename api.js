require('dotenv').config()
const abi = require('./Marketplace.json');
const bodyParser = require('body-parser')
const {ethers, utils} = require('ethers');
const express = require('express');
const cors = require('cors');
const morgan  = require('morgan');

const app = express()
const jsonParser = bodyParser.json()

app.use(express.json());  
app.use(express.urlencoded({  extended: true}));
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(morgan('dev'));

const network = ethers.providers.getNetwork("goerli");
const provider = new EtherscanProvider(network);

// const provider = new ethers.providers.JsonRpcProvider("https://rpc.slock.it/goerli"); 
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider); 
const contractAddress = process.env.CONTRACT_ADDRESS; 
const contract = new ethers.Contract(contractAddress, abi.abi, signer);

app.get('/api', (req, res)  => {
  res.json({test: "test1"})
  })

app.post('/create', jsonParser, async function(req, res) { 
  
    console.log('BODY', req.body)
  try {
    const nftContract = req.body.contract;
    const nftId = req.body.nftId;
    const price =req.body.price; // The price in wei
    // const parsedPrice = utils.parseEther(price);
    const isAuction = req.body.isAuction; // Whether it is an auction or not
    const biddingTime = req.body.biddingTime // The bidding time in seconds

    console.log('VALUES', nftContract, nftId, price, isAuction, biddingTime)

    const tx = await contract.createListing(nftContract, nftId, price, isAuction, biddingTime);
    console.log('Transaction sent: ', tx.hash);

    res.json({hash: tx.hash});
    
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message});
    }
  })

app.listen(PORT, () => {
  console.warn(`The app is listening on http://localhost:${PORT}`);
})
