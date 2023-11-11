export function convertIPFStoHTTP(ipfsURI) {
    // Convert the IPFS URI to a URL using a public IPFS gateway
    const baseUrl = 'https://ipfs.io/ipfs/';
    const ipfsPath = ipfsURI.replace('ipfs://', '');
    const url = baseUrl + ipfsPath;
    return url;
}

export async function fetchFromIPFS(ipfsURI) {
    const url = convertIPFStoHTTP(ipfsURI);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response; // or response.blob() if it's an image
    } catch (e) {
        console.error('Error fetching from IPFS:', e);
    }
}
