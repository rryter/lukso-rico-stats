import { deployContract, loadFixture, MockProvider } from "ethereum-waffle";
import { utils } from "ethers";
import ERC725AccountArtifact from "../artifacts/ERC725Account.json";
import { Erc725Account } from "../types/Erc725Account";

describe("ERC725 Account", () => {
  const provider = new MockProvider();
  const [wallet, owner] = provider.getWallets();
  const oneEth = utils.parseEther("1.0");

  async function fixture([wallet]: any[]) {
    const account: Erc725Account = (await deployContract(owner, ERC725AccountArtifact, [
      owner.address,
    ])) as Erc725Account;
    return { account, wallet };
  }

  it("initializes correctly", async () => {
    const { account } = await loadFixture(fixture);
    expect(await account.owner()).toEqual(owner.address);
  });

  it("should move value correctly", async () => {
    const { account } = await loadFixture(fixture);

    await wallet.sendTransaction({
      from: wallet.address,
      to: account.address,
      value: oneEth,
    });

    expect(await provider.getBalance(account.address)).toEqual(oneEth);
  });

  it("should set data properly", async () => {
    const { account } = await loadFixture(fixture);

    const tx = await account.setData(utils.formatBytes32String("name"), utils.formatBytes32String("Reto"));

    await tx.wait();
  });
});
