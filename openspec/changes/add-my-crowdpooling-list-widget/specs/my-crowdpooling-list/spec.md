## ADDED Requirements

### Requirement: Standalone Widget
The system SHALL provide a standalone `MyCrowdpoolingList` widget for viewing and managing crowdpooling pools created by the connected wallet.

#### Scenario: Navigate to MyCrowdpoolingList widget
- **WHEN** user navigates to MyCrowdpoolingList route
- **THEN** display the MyCrowdpoolingList widget
- **AND** check wallet connection status

#### Scenario: Show connect wallet prompt
- **WHEN** wallet is not connected
- **THEN** display prompt to connect wallet
- **AND** do not show pool table

#### Scenario: Widget displays with connected wallet
- **WHEN** wallet is connected
- **THEN** fetch and display pools created by the wallet address
- **AND** show table with pool information

### Requirement: Pool Table Display
The MyCrowdpoolingList widget SHALL display created pools in a table format using the existing `src/components/Table.tsx` component with columns: Pool Address, Price, Total Supply, Progress, Status, and Operations. The table is responsive and works on all screen sizes.

#### Scenario: Render pool table
- **WHEN** pools are loaded successfully
- **THEN** display a table with one row per pool
- **AND** columns show: Pool Address (with copy and link), Price (token ratio), Total Supply, Progress (bar + percentage + raised amount), Status (colored tag), Operations (status-based button)

#### Scenario: Display loading state
- **WHEN** pool data is being fetched
- **THEN** display loading indicator in table area

#### Scenario: Display empty state
- **WHEN** connected wallet has created no pools
- **THEN** display empty state message
- **AND** suggest creating a new crowdpooling

#### Scenario: Display error state
- **WHEN** pool data fetch fails
- **THEN** display error message with retry option

### Requirement: Pool Search Filter
The MyCrowdpoolingList widget SHALL provide a search input to filter pools by pool address or token address.

#### Scenario: Filter by pool address
- **WHEN** user enters a pool address in search input
- **THEN** filter table to show only matching pools
- **AND** partial address matching is supported

#### Scenario: Filter by token address
- **WHEN** user enters a token address in search input
- **THEN** filter table to show pools with matching base or quote token
- **AND** match against either base token or quote token address

#### Scenario: Clear search filter
- **WHEN** user clears search input
- **THEN** display all created pools again

### Requirement: Status-Based Operations
The MyCrowdpoolingList widget SHALL display operation buttons based on pool status: Invite (waiting/processing), Settle (settling), Manage (ended), Withdraw (calming, disabled).

#### Scenario: Show Invite button for waiting pools
- **WHEN** pool status is WAITING
- **THEN** display "Invite" button
- **AND** clicking opens share dialog with pool details

#### Scenario: Show Invite button for processing pools
- **WHEN** pool status is PROCESSING
- **THEN** display "Invite" button
- **AND** clicking opens share dialog with pool details

#### Scenario: Show Settle button for settling pools
- **WHEN** pool status is SETTLING
- **THEN** display "Settle" button
- **AND** clicking initiates settle flow

#### Scenario: Show disabled Withdraw button for calming pools
- **WHEN** pool status is CALMING
- **THEN** display disabled "Withdraw" button
- **AND** button is not interactive

#### Scenario: Show Manage button for ended pools
- **WHEN** pool status is ENDED
- **THEN** display "Manage" button
- **AND** clicking navigates to pool detail page

### Requirement: Pool Data Fetching
The widget SHALL fetch pool data via GraphQL API filtered by creator address.

#### Scenario: Fetch pools on widget mount
- **WHEN** widget mounts with connected wallet
- **THEN** execute GraphQL query with creator address filter
- **AND** return pools created by the connected wallet

#### Scenario: Refetch after pool creation
- **WHEN** user successfully creates a new pool
- **THEN** automatically refresh the pool list
- **AND** display the newly created pool

#### Scenario: Refetch after pool settlement
- **WHEN** user successfully settles a pool
- **THEN** automatically refresh the pool list
- **AND** update pool status to ENDED

### Requirement: Pending Transaction Display
The MyCrowdpoolingList widget SHALL indicate pools that have pending transactions (creating or settling).

#### Scenario: Show creating pool indicator
- **WHEN** a pool creation transaction is pending
- **THEN** display loading indicator for that pool row
- **AND** track transaction status via useSubmission hook

#### Scenario: Show settling pool indicator
- **WHEN** a pool settlement transaction is pending
- **THEN** display loading indicator for that pool row
- **AND** track transaction status via useSubmission hook

#### Scenario: Remove indicator after transaction completion
- **WHEN** pending transaction completes successfully
- **THEN** remove loading indicator
- **AND** refresh pool list to show updated status

### Requirement: Router Integration
The widget SHALL be accessible via router navigation with PageType.MyCrowdpoolingList.

#### Scenario: Navigate to widget
- **WHEN** user navigates to PageType.MyCrowdpoolingList
- **THEN** render MyCrowdpoolingList widget
- **AND** support browser back button

#### Scenario: Navigate to pool detail
- **WHEN** user clicks Manage button on ended pool
- **THEN** navigate to PageType.CrowdpoolingDetail with pool address and chainId
