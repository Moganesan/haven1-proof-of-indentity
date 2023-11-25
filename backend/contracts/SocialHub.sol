// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./proof-of-identity/interfaces/IProofOfIdentity.sol";

contract SocialHub is AccessControl {
  struct SocialAccount {
    string email;
    string name;
    string picture;
    string sub;
  }
  mapping(address => SocialAccount) public users;
  uint256 private _competencyRatingThreshold;

  IProofOfIdentity private _proofOfIdentity;

  event accountVerified(
    address indexed account,
    string indexed sub,
    string name,
    string indexed email,
    string picture
  );

  event profileUpdated(
    address indexed account,
    string indexed sub,
    string name,
    string indexed email,
    string picture
  );
  event CompetencyRatingThresholdUpdated(uint256 threshold);
  event POIAddressUpdated(address indexed poiAddress);
  error SimpleStoragePOI__ZeroAddress();
  error SimpleStoragePOI__NoIdentityNFT();
  error SimpleStoragePOI__Suspended();
  error SimpleStoragePOI__CompetencyRating(uint256 rating, uint256 threshold);
  error SimpleStoragePOI__AttributeExpired(string attribute, uint256 expiry);

  modifier onlyPermissioned(address account) {
    // ensure the account has a Proof of Identity NFT
    if (!_hasID(account)) revert SimpleStoragePOI__NoIdentityNFT();

    // ensure the account is not suspended
    if (_isSuspended(account)) revert SimpleStoragePOI__Suspended();

    // ensure the account has a valid competency rating
    _checkCompetencyRatingExn(account);

    _;
  }

  constructor(
    address admin,
    address proofOfIdentity_,
    uint256 competencyRatingThreshold_
  ) {
    _grantRole(DEFAULT_ADMIN_ROLE, admin);
    setPOIAddress(proofOfIdentity_);
    setCompetencyRatingThreshold(competencyRatingThreshold_);
  }

  function _checkCompetencyRatingExn(address account) private view {
    (uint256 rating, uint256 expiry, ) = _proofOfIdentity.getCompetencyRating(
      account
    );

    if (rating < _competencyRatingThreshold) {
      revert SimpleStoragePOI__CompetencyRating(
        rating,
        _competencyRatingThreshold
      );
    }

    if (!_validateExpiry(expiry)) {
      revert SimpleStoragePOI__AttributeExpired("competencyRating", expiry);
    }
  }

  function _validateExpiry(uint256 expiry) private view returns (bool) {
    return expiry > block.timestamp;
  }

  function setPOIAddress(address poi) public onlyRole(DEFAULT_ADMIN_ROLE) {
    if (poi == address(0)) revert SimpleStoragePOI__ZeroAddress();

    _proofOfIdentity = IProofOfIdentity(poi);
    emit POIAddressUpdated(poi);
  }

  function setCompetencyRatingThreshold(
    uint256 threshold
  ) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _competencyRatingThreshold = threshold;
    emit CompetencyRatingThresholdUpdated(threshold);
  }

  function _hasID(address account) private view returns (bool) {
    return _proofOfIdentity.balanceOf(account) > 0;
  }

  function _isSuspended(address account) private view returns (bool) {
    return _proofOfIdentity.isSuspended(account);
  }

  function addVerifiedUser(string memory name, string memory sub, string memory email, string memory picture) public {
    require(bytes(users[msg.sender].email).length == 0 ,"Wallet user is already exist");
    SocialAccount memory user = SocialAccount(email,name,picture,sub);
    users[msg.sender] = user;
    emit accountVerified(msg.sender, sub, name, email, picture);
  }

  function changeProfile(string memory name, string memory sub, string memory email, string memory picture) public onlyPermissioned(msg.sender){
    require(bytes(users[msg.sender].email).length != 0,"Wallet not found");
    SocialAccount memory user = SocialAccount(email, name, picture, sub);
    users[msg.sender] = user;
    emit profileUpdated(msg.sender, sub, name, email, picture);
  }

  function verifyWallet(address wallet) public view returns(string memory name, string memory email, string memory picture, string memory sub) {
    require(bytes(users[wallet].email).length != 0, "User account not found");
    SocialAccount memory user = users[wallet];
    return(user.name, user.email, user.picture, user.sub);
  }
}
