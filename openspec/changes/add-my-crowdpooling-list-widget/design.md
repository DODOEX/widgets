## Context

The "My Crowdpooling List" widget is a standalone widget that displays a list of crowdpooling pools created by the currently connected wallet address. This is a management view for pool creators to monitor and operate their pools.

**Reference Design**: Figma frame 2102:33967 (Mine)
**Reference Implementation**: `/home/junjie/dodo/dodo-young/packages/lite/src/pages-legacy/developers/Crowdpooling/List/My`

### Stakeholders
- Pool creators who need to monitor their created pools
- Users who want to share their active pools with others

## Goals / Non-Goals

**Goals:**
- Create a standalone widget for viewing user's created crowdpooling pools
- Display pools in a table format with sortable/filterable data
- Enable pool operations (share invite, settle, manage) based on pool status
- Provide search functionality to filter pools by address
- Match the existing design from Figma and old project

**Non-Goals:**
- Modifying pool settings (handled in detail view)
- Creating new pools (handled by CreateCrowdpooling widget)
- Viewing other users' pools (handled by CrowdpoolingList widget)
- Integrating with CrowdpoolingList as a tab (separate widget)

## Decisions

### Standalone Widget Architecture
- **Decision**: Create `MyCrowdpoolingList` as a completely independent widget
- **Reasoning**:
  - Separates concerns: viewing pools vs managing your own pools
  - Allows independent routing and navigation
  - Can be embedded separately from CrowdpoolingList
  - Matches the old project structure where it was a separate page
- **Alternatives considered**:
  - Add as tab in CrowdpoolingList - rejected because user wants independent widget
  - Merge into CrowdpoolingList - would make the component too large and complex

### Widget Location
- **Decision**: Place under `CrowdpoolingWidget/MyCrowdpoolingList/`
- **Reasoning**:
  - Keeps related widgets grouped together
  - Allows sharing types and utilities between Crowdpooling widgets
  - Follows existing pattern where CreateCrowdpooling is also under CrowdpoolingWidget/

### Routing
- **Decision**: Add new `PageType.MyCrowdpoolingList` to router
- **Reasoning**:
  - Allows direct navigation to the widget
  - Supports back button navigation
  - Consistent with other widgets

### Data Source
- **Decision**: Add new GraphQL query to fetch pools filtered by creator address
- **Reasoning**: Leverages existing GraphQL infrastructure, efficient filtering at API level
- **Alternatives considered**:
  - Client-side filtering - would fetch all pools, inefficient

### Table Implementation
- **Decision**: Use existing `src/components/Table.tsx` component
- **Reasoning**:
  - Native HTML table with sticky header and hover effects
  - Already styled for dark theme
  - Supports load more functionality
  - Table is responsive and works on all screen sizes (no separate mobile layout needed)
  - Reduces code duplication
- **Alternatives considered**:
  - DataTable from @dodoex/components - may not exist or have different API
  - Custom table - more maintenance
  - Separate mobile card layout - unnecessary since table handles responsive

### Status-Based Operations
- **Decision**: Show different operation buttons based on pool status
- **Reasoning**: Matches old project behavior, provides contextually relevant actions
- **Alternatives considered**:
  - Single action menu - less discoverable

## Pool Status Matrix

| Status | Operation | Action |
|-------|-----------|--------|
| WAITING | Invite | Open share dialog |
| PROCESSING | Invite | Open share dialog |
| SETTLING | Settle | Navigate to settle flow |
| CALMING | Withdraw | Disabled (pending feature) |
| ENDED | Manage | Navigate to pool detail |

## Data Flow

```
User navigates to MyCrowdpoolingList
        ↓
Widget checks wallet connection
        ↓
useMyCPList fetches pools by creator address
        ↓
GraphQL query returns pool list
        ↓
Table renders with formatted data
        ↓
User searches/filters pools (optional)
        ↓
User clicks operation button
        ↓
Navigate or open dialog based on status
```

## Widget Structure

```
packages/dodoex-widgets/src/widgets/CrowdpoolingWidget/MyCrowdpoolingList/
├── index.tsx                    # Main component
├── types.ts                     # Widget-specific types
├── components/
│   ├── MyCPTable.tsx           # Table wrapper using src/components/Table.tsx
│   ├── PoolAddressCell.tsx     # Reusable address display with copy/link
│   ├── PriceCell.tsx           # Reusable price display
│   ├── ProgressCell.tsx        # Reusable progress bar with percentage
│   ├── StatusTag.tsx           # Reusable status badge
│   └── OperationButton.tsx     # Reusable operation button
└── hooks/
    ├── useMyCPList.ts          # Data fetching hook
    └── useTableColumns.ts      # Table columns configuration
```

## Risks / Trade-offs

### Risk: Missing GraphQL Query
- **Risk**: The query for fetching pools by creator may not exist in the new codebase
- **Mitigation**: Check if query exists in `@dodoex/api`, add if missing
- **Contingency**: Use existing list query with client-side filtering

### Risk: Component Differences
- **Risk**: `@dodoex/components` DataTable may differ from old Material-UI table
- **Reasoning**: Component library has been refactored
- **Mitigation**: Review DataTable API, adapt column configuration

### Trade-off: Mobile vs Desktop Layout
- **Decision**: Single table layout for all screen sizes
- **Reasoning**: Table component is responsive, no need for separate mobile layout
- **Implementation**: Rely on `src/components/Table.tsx` responsive behavior

### Risk: Duplicate Code with CrowdpoolingList
- **Risk**: May duplicate some table rendering logic
- **Mitigation**: Share common utilities and types where possible
- **Acceptance**: Some duplication is acceptable for independent widgets

## Migration Plan

### Steps
1. Add GraphQL query to `@dodoex/api`
2. Create `MyCrowdpoolingList` widget structure
3. Add router type and navigation support
4. Implement table with columns and data formatting
5. Implement operation buttons with status-based logic
6. Test with mock data
7. Test with real data on testnet
8. Add Storybook documentation

### Rollback
- Remove widget from exports
- Remove router type
- Delete widget directory
- No impact on existing widgets

## Open Questions

1. **Query**: Should we add pagination to the MyCrowdpoolingList?
   - **Assumption**: Start without pagination, add if needed

2. **Query**: Should we show pending transactions in the list?
   - **Assumption**: Yes, use `useSubmission` to track creating/settling pools

3. **Query**: What should happen when wallet is not connected?
   - **Assumption**: Show "connect wallet" prompt or redirect

4. **Query**: Should there be a link to navigate to this widget from elsewhere?
   - **Assumption**: Yes, add link from CrowdpoolingList or a user menu
