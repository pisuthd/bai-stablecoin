const Oracle = artifacts.require('Oracle');

let instance;

contract('Oracle' , accounts => {
    before(async () => {
        instance  = await Oracle.new();
    });
        

    it('verifies that the value has been updated', async () => {

        await instance.updateValue((0.5 * 1000000));

        await instance.confirmValueUpdate();

        const value = await instance.getValue();

        assert.equal( value.toNumber() / 1000000 , 0.5);
    });

})