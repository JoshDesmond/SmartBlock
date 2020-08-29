import {strict as assert} from 'assert';
import {ModelState} from "../app/js/modelState.js";

describe('ModelState', function() {
    describe('#ModelState()', function() {
        it('should create a new ModelState object without error', function() {
            assert.doesNotThrow(() => {
                const modelState = new ModelState();
            })
        });
    });
});