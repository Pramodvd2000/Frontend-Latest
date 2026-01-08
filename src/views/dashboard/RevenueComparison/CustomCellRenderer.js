// CustomCellRenderer.js

import React from 'react';

const CustomCellRenderer = ({ value }) => {
  return <div title={value}>{value}</div>;
};

export default CustomCellRenderer;