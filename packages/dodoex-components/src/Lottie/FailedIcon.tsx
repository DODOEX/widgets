import { Box, BoxProps } from '../Box';

export default function FailedIcon({ sx }: { sx?: BoxProps['sx'] }) {
  return (
    <Box
      component="svg"
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      sx={{
        display: 'inline-block',
        width: 105,
        height: 105,
        ...sx,
      }}
    >
      <g opacity="0.5">
        <mask
          id="mask0_243_8996"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="60"
          height="60"
        >
          <rect width="60" height="60" rx="16" fill="white" />
        </mask>
        <g mask="url(#mask0_243_8996)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 30.0342H60V16.0342C60 7.19762 52.8366 0.0341797 44 0.0341797H16C7.16344 0.0341797 0 7.19762 0 16.0342V30.0342Z"
            fill="#727272"
            fillOpacity="0.4"
          />
          <path
            d="M29.4643 4H16C9.37258 4 4 9.37258 4 16V27H27.1154L31.7914 18.7271L23.1831 13.6634L29.4643 4Z"
            fill="#727272"
            fillOpacity="0.4"
          />
          <path
            d="M31.7101 27H56V16C56 9.37258 50.6274 4 44 4H34.0384L34.1766 4.08987L28.8164 12.3364L37.2081 17.2727L31.7101 27Z"
            fill="#727272"
            fillOpacity="0.4"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 44C0 52.8366 7.16344 60 16 60H44C52.8366 60 60 52.8366 60 44V30H0V44Z"
            fill="#ABABAB"
            fillOpacity="0.4"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M59.4395 44.887C59.4395 53.0975 52.7625 59.7536 44.5257 59.7536C36.2891 59.7536 29.6118 53.0975 29.6118 44.887C29.6118 36.6766 36.2891 30.0205 44.5257 30.0205C52.7625 30.0205 59.4395 36.6766 59.4395 44.887Z"
            fill="#727272"
            fillOpacity="0.4"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M29.8277 44.8665C29.8277 53.077 23.1507 59.7331 14.9139 59.7331C6.67727 59.7331 0 53.077 0 44.8665C0 36.6561 6.67727 30 14.9139 30C23.1507 30 29.8277 36.6561 29.8277 44.8665Z"
            fill="#727272"
            fillOpacity="0.4"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M51.9177 44.8873C51.9177 48.957 48.6082 52.2561 44.5255 52.2561C40.4431 52.2561 37.1333 48.957 37.1333 44.8873C37.1333 40.8176 40.4431 37.5186 44.5255 37.5186C48.6082 37.5186 51.9177 40.8176 51.9177 44.8873Z"
            fill="#444446"
          />
        </g>
      </g>
    </Box>
  );
}
