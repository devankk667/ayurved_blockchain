const AyurvedicHerbTracker = artifacts.require("AyurvedicHerbTracker");

module.exports = function (deployer) {
  deployer.deploy(AyurvedicHerbTracker);
};