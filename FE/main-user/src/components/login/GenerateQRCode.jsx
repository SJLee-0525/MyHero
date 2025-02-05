'use client';

import React from 'react';
import { Box, styled, useTheme } from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react';

const Container = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
});

export default function GenerateQRCode({ address, size = 108, bgColor = null }) {
  const theme = useTheme();

  return (
    <Container>
      <QRCodeCanvas
        value={address}
        size={size}
        bgColor={bgColor ? bgColor : theme.palette.background.paper}
        fgColor={theme.palette.mode === 'dark' ? '#fff' : '#000'}
      />
    </Container>
  );
}

<GenerateQrCode address={data.address} />