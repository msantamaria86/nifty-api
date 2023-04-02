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


const provider = new ethers.getDefaultProvider("goerli"); 
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider); 
const contractAddress = process.env.CONTRACT_ADDRESS; 
const contract = new ethers.Contract(contractAddress, abi.abi, signer);

app.get('/api', async function (req, res) {
  const id = await contract.getPrice(req.query.listingId)
  console.log('Transaction id:', id)
  });

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

    const id = await contract.createListing(nftContract, nftId, price, isAuction, biddingTime, {
      gasLimit: 100000
    });
    console.log('listing id: ', id);

    res.json({hash: tx.hash});
    
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message});
    }
  })

app.listen(PORT, () => {
  console.warn(`The app is listening on http://localhost:${PORT}`);
})
