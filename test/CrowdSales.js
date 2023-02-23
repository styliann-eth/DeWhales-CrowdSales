const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Staking', () => {
  beforeEach(async () => {
    [owner, signer2, signer3] = await ethers.getSigners();

    DeWhaleToken = await ethers.getContractFactory('DeWhaleToken', owner);
    deWhaleToken = await DeWhaleToken.deploy();

    CrowdSales = await ethers.getContractFactory('CrowdSales', owner);
    crowdSales = await CrowdSales.deploy(
      2,
      owner.address,
      deWhaleToken.address
    );
  });

  describe('buyTokens', () => {
    it('adds a token symbol', async () => {
      let totalSupply;
      let signer2Balance;
      let signer3Balance;

      totalSupply = await deWhaleToken.totalSupply();
      signer2Balance = await deWhaleToken.balanceOf(signer2.address);
      signer3Balance = await deWhaleToken.balanceOf(signer3.address);
      expect(totalSupply).to.be.equal(0);
      expect(signer2Balance).to.be.equal(0);
      expect(signer3Balance).to.be.equal(0);

      await deWhaleToken
        .connect(owner)
        .mint(crowdSales.address, ethers.utils.parseEther('10000'));

      const ownerEtherBalanceOld = await owner.getBalance();

      await crowdSales
        .connect(signer2)
        .buyTokens(signer2.address, { value: ethers.utils.parseEther('10') });
      await crowdSales
        .connect(signer3)
        .buyTokens(signer3.address, { value: ethers.utils.parseEther('20') });

      totalSupply = await deWhaleToken.totalSupply();
      signer2Balance = await deWhaleToken
        .connect(owner)
        .balanceOf(signer2.address);
      signer3Balance = await deWhaleToken
        .connect(owner)
        .balanceOf(signer3.address);
      const ownerEtherBalanceNew = await owner.getBalance();

      expect(totalSupply).to.be.equal(ethers.utils.parseEther('10000'));
      expect(signer2Balance).to.be.equal(ethers.utils.parseEther('20'));
      expect(signer3Balance).to.be.equal(ethers.utils.parseEther('40'));
      expect(ownerEtherBalanceNew).to.be.above(ownerEtherBalanceOld);
    });
  });
});
