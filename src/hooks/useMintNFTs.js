import {useEffect, useState} from 'react';
import {getEpicContract} from '../utils/getter';
import {useWalletAndNetwork} from './useWalletAndNetwork';

export function useMintNFTs() {

    const [mining, setMining] = useState(false);
    const [totalMinted, setTotalMinted] = useState(0);
    const {checkForNetwork} = useWalletAndNetwork();

    const askContractToMintNft = async () => {
        try {
            const {ethereum} = window;

            if (ethereum) {
                const epicContract = getEpicContract(ethereum);

                setMining(false)

                await checkForNetwork();

                console.log("Going to pop wallet now to pay gas...")
                let nftTxn = await epicContract.makeAnEpicNFT();

                setMining(true)
                console.log("Mining...please wait.")
                await nftTxn.wait();
                setMining(false)
                console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

                let totalMinted = await epicContract.getTotalNFTsMintedSoFar();
                setTotalMinted(totalMinted)
                console.log('totalMinted: ' + totalMinted)

            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error)
        }
    }

    const askContractForNumberOfMintedNFTs = async () => {
        try {
            const {ethereum} = window;

            if (ethereum) {
                const epicContract = getEpicContract(ethereum);

                await checkForNetwork();

                let totalMinted = await epicContract.getTotalNFTsMintedSoFar();
                setTotalMinted(totalMinted)
                console.log('totalMinted: ' + totalMinted)

            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error)
        }
    }

    return {askContractToMintNft, askContractForNumberOfMintedNFTs, mining, totalMinted};
}
