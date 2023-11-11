import { convertBigIntToNumber } from './utilities.js';
import { convertIPFStoHTTP, fetchFromIPFS } from './ipfs.js';

export async function getMintDateOfToken(web3, contract, tokenId) {
    // Get all "Transfer" events where the "tokenId" matches the one you're looking for
    // and the "from" address is the zero address
    const events = await contract.getPastEvents('Transfer', {
        filter: {
            tokenId: tokenId,
            from: '0x0000000000000000000000000000000000000000',
        },
        fromBlock: 0,
        toBlock: 'latest'
    });

    // The first event, if it exists, is the mint event
    const mintEvent = events[0];
    console.log(mintEvent);

    if (!mintEvent) {
        throw new Error(`No mint event found for tokenId: ${tokenId}`);
    }

    // Get the block details to find the timestamp
    const block = await web3.eth.getBlock(mintEvent.blockNumber);

    // Convert the timestamp to a Date object
    const mintDate = new Date(convertBigIntToNumber(block.timestamp) * 1000);

    return mintDate;
}

export async function getTokenImage(contract, tokenId) {
    // Get the token URI from the contract
    const tokenURI = await contract.methods.tokenURI(tokenId).call();
    console.log(tokenURI);

    // Fetch the token metadata using the URI
    const response = await fetchFromIPFS(tokenURI);
    console.log(response);
    const metadata = await response.json();

    // Extract the image URL from the metadata
    const imageUrl = metadata.image;

    // // Set the image URL to the img tag's src attribute
    // const imageElement = document.getElementById('tokenImage');
    // if (imageElement) {
    //     imageElement.src = convertIPFStoHTTP(imageUrl);
    //     imageElement.alt = `Token #${tokenId}`;
    // }

    return convertIPFStoHTTP(imageUrl);
}
