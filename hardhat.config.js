//https://ropsten.infura.io/v3/11d5832b72eb4fa7abcc9ca652801189

require('@nomiclabs/hardhat-waffle');

module.exports={
  solidity:'0.8.0',
  networks:{
    ropsten:{
      url:'https://ropsten.infura.io/v3/11d5832b72eb4fa7abcc9ca652801189',
      accounts:['1bf1b3c8d008d4bb7846eb9f9e3d42f301fdf073ff5d47f005ef5574ff892356']
    }
  }
}