import React, { useState, useEffect } from 'react';
import './WalletConnect.css';

export const WalletConnect = () => {
    const [currentAccount, setCurrentAccount] = useState('');
    console.log('currentAccount:', currentAccount);

    const isWalletConnected = async () => {
        const { ethereum } = window;
        if (!ethereum) {
            console.log('Make sure you have Metamask!');
            return;
        } else {
            console.log('We have the ethreum object', ethereum);
        }

        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log('Found an authorized account:', account);
            setCurrentAccount(account);
        } else {
            console.log('No authorized account found');
        }
    };

    const connectWallet = async () => {
        try {
            const { ethereum } = window;
            if (!ethereum) {
                alert('Get Metamask!');
                return;
            }
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Connected', accounts[0]);
            setCurrentAccount(accounts[0]);
            // ネットワークの確認
            const georliChainId = '0x5'; // Georli
            const chainId = await ethereum.request({ method: 'eth_chainId' });
            if (chainId !== georliChainId) {
                alert('You are not connected to the Goerli Test Network!');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const disconnectWallet = () => {
        setCurrentAccount('');
        console.log('disconnect!');
    };

    const renderNotConnectedContainer = () => (
        <button onClick={connectWallet} className="connect-wallet-button">
            Connect to Wallet
        </button>
    );

    useEffect(() => {
        isWalletConnected();
    }, []);

    return (
        <div>
            {currentAccount === '' ? (
                renderNotConnectedContainer()
            ) : (
                <button onClick={disconnectWallet} className="connected-wallet-button">
                    Disconnect Wallet
                </button>
            )}
        </div>
    );
};
