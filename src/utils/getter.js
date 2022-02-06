import abi from '../utils/MyEpicNFT.json';
import { ethers } from 'ethers';
import { contractAddress } from './config';

export function getWavePortalContract(ethereum) {
    const contractABI = abi.abi;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    return new ethers.Contract(contractAddress, contractABI, signer);
}