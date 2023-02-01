import './App.css';
import { SwapWidget } from '@dodoex/widgets';

function App() {
  return (
    <div className="App">
      <SwapWidget
        apikey="55ea0a80b62316d9bc" // for default test
        defaultChainId={4}
        colorMode="dark"
        width={400}
        height={500}
        defaultFromToken={{
          chainId: 4,
          symbol: 'DODO',
          address: '0xeaa70c2a40820dF9D38149C84dd943CFcB562587',
          name: 'DODO',
          decimals: 18,
          logoURI: '',
        }}
        defaultToToken={{
          chainId: 4,
          address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
          name: 'Ether',
          decimals: 18,
          symbol: 'ETH',
          logoURI: '',
        }}
        popularTokenList={[
          {
            chainId: 1,
            address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            name: 'USD Coin',
            decimals: 6,
            symbol: 'USDC',
            logoURI:
              'https://cmp.dodoex.io/sQ5dF3FkjjQUsmfqFFE5cKq-cthh4u0wUooBE5Epf-k/rs:fit:96:96:0/g:no/aHR0cHM6Ly9pbWFnZS1wcm94eS5kb2RvZXguaW8vTDlEVElLa2dONG5mRkNTSF9GMUdXU3JiZkJDa2JZRTkwbmFDS0dIWnRsby9hSFIwY0hNNkx5OWpaRzR0YldWa2FXRXVaRzlrYjJWNExtbHZMM1Z6WkdOZlpXVTFNbUV4WldReVlpOTFjMlJqWDJWbE5USmhNV1ZrTW1JdWNHNW4ucG5n.webp',
          },
          {
            chainId: 1,
            address: '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
            name: 'Binance USD',
            decimals: 18,
            symbol: 'BUSD',
            logoURI:
              'https://cmp.dodoex.io/xZmadzpVOnpuq2jNG_5EGKeqMET0LU_gmfnp4VxkcxI/rs:fit:96:96:0/g:no/aHR0cHM6Ly9pbWFnZS1wcm94eS5kb2RvZXguaW8vSHQwWXZKMGNnU0lGTFM0aHExTV9jOXVITV9fMHpXaHBKSGVOQU5neTBuby9hSFIwY0hNNkx5OWpaRzR0YldWa2FXRXVaRzlrYjJWNExtbHZMMkoxYzJSZk4ySTJOalJpWWpReVpDOWlkWE5rWHpkaU5qWTBZbUkwTW1RdWNHNW4ucG5n.webp',
          },
          {
            chainId: 4,
            symbol: 'DODO',
            address: '0xeaa70c2a40820dF9D38149C84dd943CFcB562587',
            name: 'DODO',
            decimals: 18,
            logoURI: '',
          },
        ]}
      />
    </div>
  );
}

export default App;
