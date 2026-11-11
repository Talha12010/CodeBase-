import React from 'react';
import * as Icons from 'lucide-react';

export const ModuleIcon = ({ name, size = 20, style = {} }) => {
  const IconComponent = Icons[name] || Icons.Box;
  return <IconComponent size={size} style={style} />;
};
