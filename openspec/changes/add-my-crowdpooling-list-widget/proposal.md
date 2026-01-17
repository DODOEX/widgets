# Change: Add My Crowdpooling List Widget

## Why
The current CrowdpoolingList widget displays all pools with tabs (Favorites, Participating, History). There is no dedicated widget for users to view and manage crowdpooling pools they have created. This feature is needed for creators to:
- View all crowdpooling pools they have created
- Monitor pool status (waiting, processing, settling, ended, calming)
- Share invitation links for active pools
- Navigate to pool management for ended pools

## What Changes
- Create new standalone widget `MyCrowdpoolingList` (independent from `CrowdpoolingList`)
- Display pool information in a table format using existing `src/components/Table.tsx`
- Table is responsive and works on both desktop and mobile (no separate mobile layout needed)
- Table columns: address, price, total supply, progress, status, operations
- Add search functionality to filter pools by address or token address
- Add operation buttons per pool based on status (Invite, Settle, Manage, Withdraw)
- Add new route type `PageType.MyCrowdpoolingList` to router
- Integrate with GraphQL API to fetch user's created pools

## Impact
- Affected specs: `my-crowdpooling-list` (new spec)
- Affected code:
  - New: `packages/dodoex-widgets/src/widgets/CrowdpoolingWidget/MyCrowdpoolingList/`
  - `packages/dodoex-widgets/src/router/types.ts` (add PageType.MyCrowdpoolingList)
  - `packages/dodoex-api/src/services/cp/graphqlQuery.ts` (add new query)
  - `packages/dodoex-widgets/src/index.tsx` (export new widget)
- Dependencies: Existing `src/components/Table.tsx`, `@dodoex/components` Button, Tag components
