module.exports = {
  'Case06_1':  function(client){
    client
      .url('http://localhost:3000/tests/6_1')
      .assert.visualRegression()
      .end()
  },
  'Case06_2':  function(client){
    client
      .url('http://localhost:3000/tests/6_2')
      .assert.visualRegression()
      .end()
  },
  'Case07_1':  function(client){
    client
      .url('http://localhost:3000/tests/7_1')
      .assert.visualRegression('body', '0')
      .click('canvas')
      .assert.visualRegression('body', '1')
      .click('canvas')
      .assert.visualRegression('body', '2')
      .click('canvas')
      .end()
  },
};