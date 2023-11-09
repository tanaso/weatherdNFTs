// Initialize Web3 by providing the Ethereum provider from MetaMask
const web3 = new Web3(window.ethereum);
console.log(web3);

// Set the NFT contract address
const contractAddress = '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D';

// Asynchronous function to load the contract ABI from a local JSON file
async function loadABI() {
    try {
        // Fetch the ABI.json file from the same directory as the HTML file
        const response = await fetch('./BAYC_ABI.json');
        // If the response is not successful, throw an error with the status
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Parse and return the ABI from the JSON response
        return await response.json();
    } catch (e) {
        // Log any errors that occur during the fetch operation
        console.error('Error loading ABI:', e);
    }
}

async function fetchEventsInBatches(contract, fromBlock, toBlock, batchSize) {
    let events = [];
    // Loop over the block range, fetching events in batches
    for (let i = fromBlock; i <= toBlock; i += batchSize) {
        const endBlock = Math.min(i + batchSize - 1, toBlock);
        try {
            const batchEvents = await contract.getPastEvents('Transfer', {
                filter: {
                    tokenId: 54,
                    from: '0x0000000000000000000000000000000000000000',
                },
                fromBlock: i,
                toBlock: endBlock
            });
            events = [...events, ...batchEvents];
        } catch (error) {
            console.error(`Error fetching events from blocks ${i} to ${endBlock}:`, error);
            break;
        }
    }
    return events;
}

async function getMintDateOfToken(contract, tokenId) {
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

function convertBigIntToNumber(value) {
  if (typeof value === 'bigint') {
    // If it's a BigInt, convert it to a Number, but check for safety first
    if (value > Number.MAX_SAFE_INTEGER) {
      throw new Error(`BigInt value is too large to be converted to a Number safely.`);
    }
    return Number(value);
  } else if (typeof value === 'number') {
    // If it's already a number, return it as-is
    return value;
  } else {
    throw new Error(`Input value is not a Number or BigInt.`);
  }
}

// When the window loads, load the contract ABI and then fetch events
window.onload = () => {
    loadABI().then(async (contractABI) => {
        // Create a contract instance with the ABI and address
        const contract = new web3.eth.Contract(contractABI, contractAddress);

        await getMintDateOfToken(contract, 50)
            .then(mintDate => {
                console.log(`The token was minted on: ${mintDate}`);
            })
            .catch(console.error);

        try {
            // Get the latest block number
            const latestBlock = await web3.eth.getBlockNumber();
            const endBlock = convertBigIntToNumber(latestBlock);
            console.log(endBlock);
            
            // Define the batch size and block range
            const batchSize = 100000; // Adjust this number based on your needs and capabilities
            const startBlock = 0; // Starting block
            // endBlock = latestBlock; // Use the latest block number here

            // Fetch all events in batches
            const allEvents = await fetchEventsInBatches(contract, startBlock, endBlock, batchSize);
            console.log(allEvents);
            // Process the events here
        } catch (err) {
            console.error('Error fetching events or getting the latest block number:', err);
        }
    }).catch((err) => {
        // Log any errors that occur while loading the contract instance
        console.error('Error loading contract instance:', err);
    });
};