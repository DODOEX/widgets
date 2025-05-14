import React from 'react';

export enum VoteTab {
  SelectToVote = 'select-to-vote',
  MyVoted = 'my-voted',
}

export function useVoteTabs() {
  const [voteTab, setVoteTab] = React.useState(VoteTab.SelectToVote);
  const tabs = React.useMemo(() => {
    const result = [
      { key: VoteTab.SelectToVote, value: 'Select to Vote' },
      {
        key: VoteTab.MyVoted,
        value: 'My Voted',
      },
    ];

    return result;
  }, []);

  const handleChangeVoteTab = (voteTab: VoteTab) => {
    setVoteTab(voteTab);
  };

  return {
    voteTab,
    tabs,
    handleChangeVoteTab,
  };
}
