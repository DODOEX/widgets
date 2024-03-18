/// <reference types="react" />
declare const ButtonBase: import('@emotion/styled').StyledComponent<
  Pick<
    import('@mui/base/ButtonUnstyled').ButtonUnstyledOwnProps &
      Omit<
        any,
        keyof import('@mui/base/ButtonUnstyled').ButtonUnstyledOwnProps
      > & {
        component?: import('react').ElementType<any> | undefined;
      },
    string | number | symbol
  > &
    import('react').RefAttributes<any> &
    import('@mui/system').MUIStyledCommonProps<import('@mui/system').Theme>,
  {},
  {}
>;
export default ButtonBase;
