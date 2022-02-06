import abi from '../utils/MyEpicNFT.json';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS } from './config';

export function getEpicContract(ethereum) {
    const contractABI = abi.abi;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    return new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
}