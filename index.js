// Update the import paths to include the 'src/' directory
import { getRandomInt, loadABI, fetchEventsInBatches, convertBigIntToNumber } from './src/utilities.js';
import { convertIPFStoHTTP, fetchFromIPFS } from './src/ipfs.js';
import { getMintDateOfToken, getTokenImage } from './src/nft.js';
import { drawP5 } from './src/p5ImageProcessor.js';
import { initWebGL } from './src/webgl.js';

// Initialize Web3
const web3 = new Web3(window.ethereum);

// Set the NFT contract address and random token ID
const contractAddress = '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D';
const tokenID = getRandomInt(0, 10000);

window.onload = async () => {
    try {
        const contractABI = await loadABI('./BAYC_ABI.json');
        const contract = new web3.eth.Contract(contractABI, contractAddress);

        // Perform NFT operations
        const mintDate = await getMintDateOfToken(web3, contract, tokenID);
        console.log(`The token was minted on: ${mintDate}`);

        const imageUrl = await getTokenImage(contract, tokenID);
        console.log(`The image URL for the token is: ${imageUrl}`);

        // Set the image URL to the img tag's src attribute
        const imageElement = document.getElementById('tokenImage');
        if (imageElement) {
            imageElement.src = imageUrl;
            imageElement.alt = `Token #${tokenID}`;
        }
        // initWebGL(imageUrl);
        drawP5(imageUrl);

    } catch (err) {
        console.error('Error in window.onload:', err);
    }
};