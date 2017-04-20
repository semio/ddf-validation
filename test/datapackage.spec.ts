import * as chai from 'chai';
import { isEqual } from 'lodash';
import { DataPackage } from '../src/data/data-package';

const expect = chai.expect;

describe('datapackage validation', () => {
  describe('when "ddf--unpop--wpp_population" dataset', () => {
    it('should datapackage be created propery', done => {
      const dataPackageTemplate = require('./fixtures/data-package/ddf--unpop--wpp_population/datapackage.template.json');
      const dataPackage = new DataPackage('./test/fixtures/data-package/ddf--unpop--wpp_population/');

      dataPackage.take(dataPackageObject => {
        expect(isEqual(dataPackageObject, dataPackageTemplate)).to.be.true;

        done();
      });
    });
  });
});
