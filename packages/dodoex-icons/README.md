# ICONS

Inspired by [mui-icons](https://github.com/mui/material-ui/tree/master/packages/mui-icons-material).

Convert svg into an independent React Component and generate type files (no dependency to any other components).

## HOW TO USE

```TypeScript
import { ArrowBack } from '@dodoex/icons';

<ArrowBack />
```

## HOW TO UPDATE ICONS

Place icons into the `assets` directory and execute commands to generate ICONS.


```Bash
yarn workspace @dodoex/icons src:icons
yarn build
```