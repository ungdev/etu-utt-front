import Button from './Button';
import { ReactNode } from 'react';
import Tooltip from './Tooltip';

export default function DisableableButton(params: {
  children: ReactNode;
  disabledTooltip: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  noStyle?: boolean;
  background?: 'blue' | 'white';
  noTab?: boolean;
}) {
  return params.disabled ? (
    <Tooltip content={params.disabledTooltip} styles={['TOP', 'SIZE_MEDIUM', 'TEXT_CENTER', 'DISABLED']}>
      <Button {...params} />
    </Tooltip>
  ) : (
    <Button {...params} />
  );
}
