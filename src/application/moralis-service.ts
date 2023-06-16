import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";

const readAddress = async (tokenAddress: string, userAddress: string, block: number) => {
    await Moralis.start({
        apiKey: "nw6VERjC5bDt8huv6gVU0sAXvDo0agOEr8IeqPpOqgI9EFJM7IbcEzKejALGviH3",
        // ...and any other configuration
    });

    const address = "0xeE9e174094db61fc9BF92d3FDf15941DfA9aA033";

    const chain = EvmChain.ETHEREUM;

    const response = await Moralis.EvmApi.balance.getNativeBalance({
        toBlock: block,
        address,
        chain,
    });

    console.log(response.toJSON());
};