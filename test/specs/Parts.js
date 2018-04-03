module.exports = {
  'Case01':  function(client){
    client
      .url('http://localhost:3000/tests/1')
      .assert.visualRegression()
      .end()
  },
  'Case02':  function(client){
    client
      .url('http://localhost:3000/tests/2')
      .assert.visualRegression()
      .end()
  },
  'Case03_1':  function(client){
    client
      .url('http://localhost:3000/tests/3_1')
      .assert.visualRegression('body', '0')
      .click('canvas')
      .assert.visualRegression('body', '1')
      .click('canvas')
      .end()
  },
  // 'Case03_2':  function(client){
  //   client
  //     .url('http://localhost:3000/tests/3_2')
  //     .assert.visualRegression('body', '0')
  //     .click('canvas')
  //     .assert.visualRegression('body', '1')
  //     .click('canvas')
  //     .assert.visualRegression('body', '2')
  //     .click('canvas')
  //     .end()
  // },
  'Case03_3':  function(client){
    client
      .url('http://localhost:3000/tests/3_3')
      .assert.visualRegression('body', '0')
      .click('canvas')
      .assert.visualRegression('body', '1')
      .click('canvas')
      .assert.visualRegression('body', '2')
      .click('canvas')
      .end()
  },
  'Case03_4':  function(client){
    client
      .url('http://localhost:3000/tests/3_4')
      .assert.visualRegression('body', '0')
      .click('canvas')
      .assert.visualRegression('body', '1')
      .click('canvas')
      .assert.visualRegression('body', '2')
      .click('canvas')
      .end()
  },
  'Case04_1':  function(client){
    client
      .url('http://localhost:3000/tests/4_1')
      .assert.visualRegression('body', '0')
      .click('canvas')
      .assert.visualRegression('body', '1')
      .click('canvas')
      .end()
  },
  'Case04_2':  function(client){
    client
      .url('http://localhost:3000/tests/4_2')
      .assert.visualRegression('body', '0')
      .click('canvas')
      .assert.visualRegression('body', '1')
      .click('canvas')
      .assert.visualRegression('body', '2')
      .click('canvas')
      .end()
  },
  'Case04_3':  function(client){
    client
      .url('http://localhost:3000/tests/4_3')
      .assert.visualRegression('body', '0')
      .click('canvas')
      .assert.visualRegression('body', '1')
      .click('canvas')
      .assert.visualRegression('body', '2')
      .click('canvas')
      .end()
  },
  'Case04_4':  function(client){
    client
      .url('http://localhost:3000/tests/4_4')
      .assert.visualRegression('body', '0')
      .click('canvas')
      .assert.visualRegression('body', '1')
      .click('canvas')
      .assert.visualRegression('body', '2')
      .click('canvas')
      .end()
  }
};