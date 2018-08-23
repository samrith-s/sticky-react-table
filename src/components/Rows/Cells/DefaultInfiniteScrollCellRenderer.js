import React from 'react';
import { BarLoader } from 'react-spinners';

import { defaultInfiniteScrollCellStyle } from '../../../styles/cell.styles';

const DefaultInfiniteScrollCellRenderer = () => {
  return (
    <div style={defaultInfiniteScrollCellStyle}>
      <BarLoader loading width={100} widthUnit="%" color="#fff" height={8} />
    </div>
  );
};

export default DefaultInfiniteScrollCellRenderer;
