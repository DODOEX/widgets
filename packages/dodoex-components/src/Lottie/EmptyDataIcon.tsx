import { Box, BoxProps } from '../Box';

export default function EmptyDataIcon({
  hasSearch,
  sx,
}: {
  hasSearch?: boolean;
  sx?: BoxProps['sx'];
}) {
  if (hasSearch) {
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
        <g opacity="0.4">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 0V37.5847H0.00577271V60H59.9942V37.5847H60V0H0Z"
            fill="#727272"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 0V24.4129H0.00377446V38.9726H38.9689V24.4129H38.9727V0H0Z"
            fill="#ABABAB"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20.9274 20.9272L20.931 59.9001H59.8961V45.3404H59.8999V20.9272H20.9274Z"
            fill="#ABABAB"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M23.3955 4.84717C12.9265 4.84717 4.43951 13.334 4.43951 23.803C4.43951 34.2723 12.9265 42.7591 23.3955 42.7591C27.2722 42.7591 30.8771 41.5954 33.8799 39.5982L50.5917 56.3155L55.7028 50.6922L39.2334 34.2227C41.2043 31.2329 42.3513 27.6519 42.3513 23.803C42.3513 13.334 33.8646 4.84717 23.3955 4.84717ZM23.3955 35.0555C17.181 35.0555 12.1432 30.0177 12.1432 23.8031C12.1432 17.5886 17.181 12.5507 23.3955 12.5507C29.6101 12.5507 34.6479 17.5886 34.6479 23.8031C34.6479 30.0177 29.6101 35.0555 23.3955 35.0555Z"
            fill="#656565"
          />
        </g>
      </Box>
    );
  }

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
          id="mask0_243_8995"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="60"
          height="60"
        >
          <rect width="60" height="60" rx="16" fill="white" />
        </mask>
        <g mask="url(#mask0_243_8995)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 30.1054H60V0H0V30.1054Z"
            fill="#727272"
            fillOpacity="0.4"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.00579834 59.8096H59.9945V30.0566H0.00579834V59.8096Z"
            fill="#ABABAB"
            fillOpacity="0.4"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M59.8259 15.098C59.8259 23.3084 53.1489 29.9645 44.9121 29.9645C36.6755 29.9645 29.9982 23.3084 29.9982 15.098C29.9982 6.88754 36.6755 0.231445 44.9121 0.231445C53.1489 0.231445 59.8259 6.88754 59.8259 15.098Z"
            fill="#727272"
            fillOpacity="0.4"
          />
          <mask
            id="mask1_243_8995"
            maskUnits="userSpaceOnUse"
            x="30"
            y="30"
            width="30"
            height="30"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M30.0506 30.267H59.8783V60H30.0506V30.267Z"
              fill="white"
            />
          </mask>
          <g mask="url(#mask1_243_8995)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M59.8783 45.1335C59.8783 53.344 53.2013 60.0001 44.9645 60.0001C36.7279 60.0001 30.0506 53.344 30.0506 45.1335C30.0506 36.9231 36.7279 30.267 44.9645 30.267C53.2013 30.267 59.8783 36.9231 59.8783 45.1335Z"
              fill="#727272"
              fillOpacity="0.4"
            />
          </g>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M30.2141 15.0772C30.2141 23.2877 23.537 29.9438 15.3002 29.9438C7.06363 29.9438 0.386353 23.2877 0.386353 15.0772C0.386353 6.86679 7.06363 0.210693 15.3002 0.210693C23.537 0.210693 30.2141 6.86679 30.2141 15.0772Z"
            fill="#727272"
            fillOpacity="0.4"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M30.2141 45.1335C30.2141 53.344 23.537 60.0001 15.3002 60.0001C7.06363 60.0001 0.386353 53.344 0.386353 45.1335C0.386353 36.9231 7.06363 30.267 15.3002 30.267C23.537 30.267 30.2141 36.9231 30.2141 45.1335Z"
            fill="#727272"
            fillOpacity="0.4"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M52.3042 15.098C52.3042 19.1677 48.9947 22.4668 44.912 22.4668C40.8296 22.4668 37.5198 19.1677 37.5198 15.098C37.5198 11.0283 40.8296 7.72925 44.912 7.72925C48.9947 7.72925 52.3042 11.0283 52.3042 15.098Z"
            fill="#444446"
          />
        </g>
      </g>
    </Box>
  );
}
