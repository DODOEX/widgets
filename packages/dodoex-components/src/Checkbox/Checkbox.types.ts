import type { PolymorphicProps } from '@mui/base/utils/PolymorphicComponent';
import { BoxProps } from '../Box';

interface CheckboxOwnProps {
  children?: React.ReactNode;
  className?: string;
  size?: number;
  sx?: BoxProps['sx'];
}

export interface CheckboxTypeMap<
  AdditionalProps = {},
  RootComponentType extends React.ElementType = 'input',
> {
  props: CheckboxOwnProps & AdditionalProps;
  defaultComponent: RootComponentType;
}

export type CheckboxProps<
  RootComponentType extends React.ElementType = CheckboxTypeMap['defaultComponent'],
> = PolymorphicProps<CheckboxTypeMap<{}, RootComponentType>, RootComponentType>;
