## 1. API Layer
- [ ] 1.1 Add GraphQL query to fetch user's created crowdpooling pools in `@dodoex/api`
- [ ] 1.2 Add TypeScript types for the API response
- [ ] 1.3 Add hook `useMyCPList` to fetch and cache data with user address filter

## 2. Widget Structure
- [ ] 2.1 Create `MyCrowdpoolingList` directory under `CrowdpoolingWidget/`
- [ ] 2.2 Create `MyCrowdpoolingList/index.tsx` main component
- [ ] 2.3 Create `types.ts` for MyCrowdpoolingList-specific types
- [ ] 2.4 Add PageType.MyCrowdpoolingList to router/types.ts
- [ ] 2.5 Export new widget from `src/index.tsx`

## 3. Table Components
- [ ] 3.1 Create table columns configuration (address, price, supply, progress, status, operate)
- [ ] 3.2 Implement pool address display with copy and link functionality
- [ ] 3.3 Implement price display with proper token formatting
- [ ] 3.4 Implement total supply display
- [ ] 3.5 Implement progress bar with percentage and raised amount
- [ ] 3.6 Implement status tag with color coding by status type
- [ ] 3.7 Use existing `src/components/Table.tsx` component (responsive for all screen sizes)

## 4. Operations
- [ ] 4.1 Implement Invite button for waiting/processing status pools (opens share dialog)
- [ ] 4.2 Implement Settle button for settling status pools
- [ ] 4.3 Implement Manage button for ended status pools (navigates to detail)
- [ ] 4.4 Implement disabled Withdraw button for calming status pools

## 5. Search and Filter
- [ ] 5.1 Add search input component for filtering by pool address or token address
- [ ] 5.2 Implement filter logic for table data
- [ ] 5.3 Add clear button to search input

## 6. Loading States
- [ ] 6.1 Implement loading state for table data
- [ ] 6.2 Implement pending transaction indicator (for creating/settling pools)
- [ ] 6.3 Handle error state with retry option

## 7. Share Dialog Integration
- [ ] 7.1 Integrate existing CrowdpoolingShareDialog for Invite action
- [ ] 7.2 Pass correct pool data to share dialog

## 8. Navigation
- [ ] 8.1 Wire up router to support MyCrowdpoolingList page
- [ ] 8.2 Test navigation from other widgets to MyCrowdpoolingList
- [ ] 8.3 Test pool detail navigation from Manage button

## 9. Documentation
- [ ] 9.1 Add Storybook story for `MyCrowdpoolingList`
- [ ] 9.2 Add widget to main widget exports
- [ ] 9.3 Test responsive table on different screen sizes
