import React from 'react';
import { WalletConnect } from '../WalletConnect/WalletConnect';
import './Header.css';

export const Header = () => {
    return (
        <div className="header">
            <div className="header-title">
                <h2>NFT-Minter</h2>
            </div>
            <WalletConnect></WalletConnect>
        </div>
    );
};
