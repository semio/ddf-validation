'use strict';
const _ = require('lodash');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const DdfDataSet = require('../lib/ddf-definitions/ddf-data-set');
const rulesRegistry = require('../lib/ddf-rules/registry');
const indexRules = require('../lib/ddf-rules/index-rules');
const expect = chai.expect;

chai.use(sinonChai);

describe('rules for index', () => {
  let ddfDataSet = null;

  describe('when wrong file in index details', () => {
    beforeEach(() => {
      ddfDataSet = new DdfDataSet('./test/fixtures/wrong-file-in-index');
    });

    afterEach(done => {
      ddfDataSet.dismiss(() => {
        done();
      });
    });

    it('should one issue is found', done => {
      ddfDataSet.load(() => {
        const result = indexRules[rulesRegistry.INCORRECT_FILE](ddfDataSet);

        expect(result.length).to.equal(1);

        done();
      });
    });

    it('issue should be "INCORRECT_FILE" type', done => {
      ddfDataSet.load(() => {
        const result = indexRules[rulesRegistry.INCORRECT_FILE](ddfDataSet);

        expect(result[0].type).to.equal(rulesRegistry.INCORRECT_FILE);

        done();
      });
    });

    it('should path field of the issue contains "foo.csv"', done => {
      ddfDataSet.load(() => {
        const result = indexRules[rulesRegistry.INCORRECT_FILE](ddfDataSet);

        expect(result[0].path.indexOf('foo.csv')).to.be.greaterThan(0);

        done();
      });
    });
  });

  describe('when index is correct', () => {
    afterEach(done => {
      ddfDataSet.dismiss(() => {
        done();
      });
    });

    it('should issues are NOT found', done => {
      ddfDataSet = new DdfDataSet('./test/fixtures/dummy-companies-with-index');
      ddfDataSet.load(() => {
        const result = indexRules[rulesRegistry.INCORRECT_FILE](ddfDataSet);

        expect(result.length).to.equal(0);

        done();
      });
    });
  });

  describe('when index does not exist', () => {
    beforeEach(() => {
      ddfDataSet = new DdfDataSet('./test/fixtures/dummy-companies');
    });

    afterEach(done => {
      ddfDataSet.dismiss(() => {
        done();
      });
    });

    it('should 1 error is recognized', done => {
      ddfDataSet.load(() => {
        const result = indexRules[rulesRegistry.INDEX_IS_NOT_FOUND](ddfDataSet);

        expect(!!result).to.equal(true);
        expect(result.length).to.equal(1);

        done();
      });
    });

    it('should error has "INDEX_IS_NOT_FOUND" type', done => {
      ddfDataSet.load(() => {
        const result = indexRules[rulesRegistry.INDEX_IS_NOT_FOUND](ddfDataSet);

        expect(result[0].type).to.equal(rulesRegistry.INDEX_IS_NOT_FOUND);

        done();
      });
    });

    it('should data from issue contains an input ddf path', done => {
      ddfDataSet.load(() => {
        const result = indexRules[rulesRegistry.INDEX_IS_NOT_FOUND](ddfDataSet);

        expect(result[0].path).to.equal('./test/fixtures/dummy-companies');

        done();
      });
    });
  });

  describe('when index based rules checking', () => {
    afterEach(done => {
      ddfDataSet.dismiss(() => {
        done();
      });
    });

    describe('and WRONG_INDEX_KEY rule', () => {
      it('should any issue is NOT found for good folder', done => {
        ddfDataSet = new DdfDataSet('./test/fixtures/good-folder-indexed');

        ddfDataSet.load(() => {
          const results = indexRules[rulesRegistry.WRONG_INDEX_KEY](ddfDataSet);

          expect(_.isEmpty(results)).to.be.true;

          done();
        });
      });

      it(`should expected issue is found for folder with the problem
    (fixtures/rules-cases/wrong-index-key)`, done => {
        ddfDataSet = new DdfDataSet('./test/fixtures/rules-cases/wrong-index-key');

        ddfDataSet.load(() => {
          const results = indexRules[rulesRegistry.WRONG_INDEX_KEY](ddfDataSet);

          expect(results.length).to.equal(1);

          const result = _.head(results);
          const expectedIssueData = ['foo', 'bar'];

          expect(result.type).to.equal(rulesRegistry.WRONG_INDEX_KEY);
          expect(_.isEqual(result.data, expectedIssueData)).to.be.true;

          done();
        });
      });
    });

    describe('and WRONG_INDEX_VALUE rule', () => {
      it('should any issue is NOT found for good folder', done => {
        ddfDataSet = new DdfDataSet('./test/fixtures/good-folder-indexed');

        ddfDataSet.load(() => {
          const results = indexRules[rulesRegistry.WRONG_INDEX_VALUE](ddfDataSet);

          expect(_.isEmpty(results)).to.be.true;

          done();
        });
      });

      it(`should expected issue is found for folder with the problem
    (fixtures/rules-cases/wrong-index-value)`, done => {
        ddfDataSet = new DdfDataSet('./test/fixtures/rules-cases/wrong-index-value');

        ddfDataSet.load(() => {
          const results = indexRules[rulesRegistry.WRONG_INDEX_VALUE](ddfDataSet);

          expect(results.length).to.equal(1);

          const result = _.head(results);

          const expectedIssueData = ['foo', 'geo_name'];

          expect(result.type).to.equal(rulesRegistry.WRONG_INDEX_VALUE);
          expect(_.isEqual(result.data, expectedIssueData)).to.be.true;

          done();
        });
      });
    });
  });
});
