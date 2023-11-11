export function getRandomInt(min, max) {
    // The maximum is exclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min) + min);
}

export async function loadABI(path) {
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

export async function fetchEventsInBatches(contract, fromBlock, toBlock, batchSize) {
    // ... existing fetchEventsInBatches code ...
    let events = [];
    // Loop over the block range, fetching events in batches
    for (let i = fromBlock; i <= toBlock; i += batchSize) {
        const endBlock = Math.min(i + batchSize - 1, toBlock);
        try {
            const batchEvents = await contract.getPastEvents('Transfer', {
                filter: {
                    tokenId: tokenID,
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

export function convertBigIntToNumber(value) {
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
