import Web3 from 'web3';

const getWeb3 = () =>
    new Promise ((resolve, reject) => {
      // 监听事件
      window.addEventListener("load", async () => {
        // Modern dapp browsers...
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);

          try {
            // 请求账户
            await window.ethereum.request({ method: 'eth_requestAccounts' }); //返回账户
            resolve(web3);
          } catch (error) {
            reject("User denied account access. " + error);
            console.log("User denied account access. " + error)
          }
        }
        // 支持旧版本的浏览器
        else if (window.web3) {
          // 使用MetaMask的provider.
          const web3 = window.web3;
          console.log("Injected web3 detected.");
          resolve(web3);
        }
        // 使用Infura提供的Goerli测试网的接口
        else {
          const provider = new Web3.providers.HttpProvider(
              "https://goerli.infura.io/v3/:8545"
          );
          const web3 = new Web3(provider);
          console.log("No web3 instance injected, using Local web3.");
          resolve(web3);
        }
      });
    });

export default getWeb3;