import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QRCodeGenerator = ({ walletAddress, walletConnected }) => {
  const [qrCodeData, setQrCodeData] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrType, setQrType] = useState('address'); // 'address' or 'payment'
  const [paymentAmount, setPaymentAmount] = useState('');

  useEffect(() => {
    if (walletAddress) {
      generateQRCode();
    }
  }, [walletAddress, qrType, paymentAmount]);

  const generateQRCode = () => {
    if (!walletAddress) return;

    let qrData = '';
    
    if (qrType === 'address') {
      qrData = walletAddress;
    } else if (qrType === 'payment' && paymentAmount) {
      qrData = `web+stellar:pay?destination=${walletAddress}&amount=${paymentAmount}&asset_code=XLM`;
    }
    
    setQrCodeData(qrData);
  };

  const generateQRCodeSVG = (data) => {
    // Simple QR code placeholder - in a real app, use a QR code library
    const size = 200;
    const cellSize = size / 25;
    
    // Generate a simple pattern based on the data
    const pattern = [];
    for (let i = 0; i < 25; i++) {
      pattern[i] = [];
      for (let j = 0; j < 25; j++) {
        const hash = data?.charCodeAt((i * 25 + j) % data?.length);
        pattern[i][j] = hash % 2 === 0;
      }
    }

    return (
      <svg width={size} height={size} className="border border-border rounded-lg">
        <rect width={size} height={size} fill="white" />
        {pattern?.map((row, i) =>
          row?.map((cell, j) =>
            cell ? (
              <rect
                key={`${i}-${j}`}
                x={j * cellSize}
                y={i * cellSize}
                width={cellSize}
                height={cellSize}
                fill="black"
              />
            ) : null
          )
        )}
      </svg>
    );
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
  };

  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Wallet Address',
          text: `Send XLM to: ${walletAddress}`,
          url: `stellar:${walletAddress}`
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  if (!walletConnected) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="text-center space-y-4">
          <Icon name="QrCode" size={48} className="text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">QR Code</h3>
            <p className="text-muted-foreground">Connect your wallet to generate QR codes</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">QR Code Generator</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowQRCode(!showQRCode)}
          iconName={showQRCode ? "ChevronUp" : "ChevronDown"}
        />
      </div>
      {showQRCode && (
        <div className="space-y-4">
          {/* QR Type Selector */}
          <div className="flex space-x-2">
            <Button
              variant={qrType === 'address' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setQrType('address')}
            >
              Address
            </Button>
            <Button
              variant={qrType === 'payment' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setQrType('payment')}
            >
              Payment Request
            </Button>
          </div>

          {/* Payment Amount Input */}
          {qrType === 'payment' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">
                Amount (XLM)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="0.00"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e?.target?.value)}
                  className="flex-1 px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateQRCode}
                  iconName="RefreshCw"
                >
                  Generate
                </Button>
              </div>
            </div>
          )}

          {/* QR Code Display */}
          {qrCodeData && (
            <div className="space-y-4">
              <div className="flex justify-center">
                {generateQRCodeSVG(qrCodeData)}
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-card-foreground">
                      {qrType === 'address' ? 'Wallet Address' : 'Payment Request'}
                    </span>
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => copyToClipboard(qrCodeData)}
                      iconName="Copy"
                    >
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground break-all">
                    {qrCodeData}
                  </p>
                </div>

                {qrType === 'payment' && paymentAmount && (
                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-card-foreground">Requested Amount</span>
                      <span className="text-lg font-bold text-primary">{paymentAmount} XLM</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(qrCodeData)}
                  iconName="Copy"
                  className="flex-1"
                >
                  Copy Data
                </Button>
                {navigator.share && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareQRCode}
                    iconName="Share"
                    className="flex-1"
                  >
                    Share
                  </Button>
                )}
              </div>

              {/* Instructions */}
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="text-sm font-medium text-card-foreground mb-2">How to use:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li className="flex items-start space-x-2">
                    <Icon name="Smartphone" size={12} className="mt-0.5" />
                    <span>Scan with any Stellar-compatible wallet app</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="Share" size={12} className="mt-0.5" />
                    <span>Share the QR code or copy the data to send to others</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="Shield" size={12} className="mt-0.5" />
                    <span>QR codes are safe to share - they only contain your public address</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;