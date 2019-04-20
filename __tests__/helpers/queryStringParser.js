/**
 * Created by ashish on 11/12/16.
 */
const path = require('path');
const loForEach = require('lodash/forEach');
const { ConditionBuilder, Prepare } = require('../../src/helpers/queryStringParser');

const parentPath = path.join(__dirname, '..', 'samples');
const classes = [
  'credits',
  'gateways',
  'invoices',
  'organisations',
  'plans',
  'users',
  'missingClass',
];

describe('helpers.queryStringParser', () => {
  describe('ConditionBuilder', () => {
    it('/parent (1)', () => {
      const urlParams = {
        parent: 'organisations',
      };
      const conditions = ConditionBuilder(urlParams, classes, parentPath);
      expect(conditions.class.PLURAL).toEqual(urlParams.parent);
      expect(conditions.cond).toEqual([]);
    });

    it('/parent (invalid parent)', () => {
      const urlParams = {
        parent: 'applications',
      };
      expect(() => ConditionBuilder(urlParams, classes, parentPath)).toThrow('E0001:Bad resource name');
    });

    it('/parent/id', () => {
      const urlParams = {
        parent: 'organisations',
        id: 10,
      };
      const conditions = ConditionBuilder(urlParams, classes, parentPath);
      expect(conditions.class.PLURAL).toEqual(urlParams.parent);
      expect(conditions.cond).toEqual([{ field: 'id', value: 10 }]);
    });

    it('/parent/id/association (1TO1)', () => {
      const urlParams = {
        parent: 'users',
        id: 'ashish@itcutives.com',
        association: 'invoices',
      };
      const conditions = ConditionBuilder(urlParams, classes, parentPath);
      expect(conditions.class.PLURAL).toEqual(urlParams.association);
      expect(conditions.cond).toEqual([{ field: 'user_id', value: 'ashish@itcutives.com' }]);
    });

    it('/parent/id/association (1TOM)', () => {
      const urlParams = {
        parent: 'credits',
        id: 10,
        association: 'gateways',
      };
      const conditions = ConditionBuilder(urlParams, classes, parentPath);
      expect(conditions.class.PLURAL).toEqual(urlParams.association);
      expect(conditions.cond).toEqual([{
        field: 'id',
        operator: 'in',
        value: {
          class: require('../samples/models/credits'),
          condition: {
            id: 10,
          },
          select: 'gateway_id',
        },
      }]);
    });

    it('/parent/id/association (MTOM)', () => {
      const urlParams = {
        parent: 'users',
        id: 'ashish@itcutives.com',
        association: 'organisations',
      };
      const conditions = ConditionBuilder(urlParams, classes, parentPath);
      expect(conditions.class.PLURAL).toEqual(urlParams.association);
      expect(conditions.cond).toEqual([{
        field: 'id',
        operator: 'in',
        value: {
          table: 'permission',
          condition: {
            user_id: 'ashish@itcutives.com',
          },
          select: 'organisation_id',
        },
      }]);
    });

    it('/parent/id/association (MTOM) other way', () => {
      const urlParams = {
        parent: 'organisations',
        id: 10,
        association: 'users',
      };
      const conditions = ConditionBuilder(urlParams, classes, parentPath);
      expect(conditions.class.PLURAL).toEqual(urlParams.association);
      expect(conditions.cond).toEqual([{
        field: 'id',
        operator: 'in',
        value: {
          table: 'permission',
          condition: {
            organisation_id: 10,
          },
          select: 'user_id',
        },
      }]);
    });

    it('/parent/id/association (invalid association)', () => {
      const urlParams = {
        parent: 'organisations',
        id: 10,
        association: 'plans',
      };
      expect(() => ConditionBuilder(urlParams, classes, parentPath)).toThrow('E0014:Bad entity relationship');
    });

    it('/parent/id/association (invalid parent link)', () => {
      const urlParams = {
        parent: 'plans',
        id: 10,
        association: 'invoices',
      };
      expect(() => ConditionBuilder(urlParams, classes, parentPath)).toThrow('E0014:Bad entity relationship');
    });

    it('should throw exception when /association is not valid', () => {
      const urlParams = {
        parent: 'organisations',
        id: 10,
        association: 'users1',
      };
      expect(() => ConditionBuilder(urlParams, classes, parentPath)).toThrow('E0001:Bad resource name');
    });

    it('should throw exception when /association file is not valid', () => {
      const urlParams = {
        parent: 'organisations',
        id: 10,
        association: 'missingClass',
      };
      expect(() => ConditionBuilder(urlParams, classes, parentPath)).toThrow('E0013:Bad resource name');
    });

    it('should throw exception when /parent is not valid', () => {
      const urlParams = {
        parent: 'users1',
      };
      expect(() => ConditionBuilder(urlParams, classes, parentPath)).toThrow('E0001:Bad resource name');
    });

    it('should throw exception when /parent file is not valid', () => {
      const urlParams = {
        parent: 'missingClass',
      };
      expect(() => ConditionBuilder(urlParams, classes, parentPath)).toThrow('E0013:Bad resource name');
    });
  });

  describe('prepare.filter', () => {
    const cls = {
      FIELDS: ['a', 'b'],
    };

    it('should return empty array if there is nothing provided', () => {
      expect(Prepare.filter(cls)).toEqual([]);
    });

    it('should return array of filters when field name is json path', () => {
      const filter = { field: 'a.b', value: 'aa' };
      expect(Prepare.filter(cls, JSON.stringify(filter))).toEqual([filter]);
    });

    it('should return array of filters when only one item in filter provided', () => {
      const filter = { field: 'a', value: 'aa' };
      expect(Prepare.filter(cls, JSON.stringify(filter))).toEqual([filter]);
    });

    it('should return array of filters when multipme items in filter provided', () => {
      const filter = [{ field: 'a', value: 'aa' }, { field: 'b', operator: '=', value: 'bb' }];
      expect(Prepare.filter(cls, [JSON.stringify(filter[0]), JSON.stringify(filter[1])])).toEqual(filter);
    });

    it("should return array of filters when multipme items in filter provided and shouldn't include broken json object", () => {
      const filter = [{ field: 'a', value: 'aa' }, { field: 'b', operator: '=', value: 'bb' }];
      expect(Prepare.filter(cls, [JSON.stringify(filter[0]), JSON.stringify(filter[1]).substr(1)])).toEqual([filter[0]]);
    });

    it('should return array of filters when input is not string array but objects', () => {
      const filter = [{ field: 'b', operator: '=', value: 'bb' }];
      expect(Prepare.filter(cls, filter)).toEqual(filter);
    });

    it('should return empty array of filters when input fields are not valid', () => {
      const filter = [{ field: 'c', operator: '=', value: 'bb' }];
      expect(Prepare.filter(cls, filter)).toEqual([]);
    });

    it('should return empty array of filters when invalid json is provided', () => {
      const filter = '{"field":"a.b","value":"aa"';
      expect(Prepare.filter(cls, filter)).toEqual([]);
    });

    it('should return array of filters when only single object in json string provided', () => {
      const filter = '[{"field":"a.b","value":"aa"}]';
      expect(Prepare.filter(cls, filter)).toEqual(JSON.parse(filter));
    });
  });

  describe('prepare.fields', () => {
    const list = {
      '': {
        fields: [
          'id',
          'name',
          'config',
          'created_at',
          'status',
          'plan_id',
          'subscription',
          'created_by',
          'expiry',
        ],
        links: [
          'gateways',
          'users',
          'invoices',
          'credits',
          'plans',
        ],
      },
      'a,id,b': {
        fields: ['id', 'plan_id'],
        links: ['plans'],
      },
      'id,links.plans': {
        fields: ['id', 'plan_id'],
        links: ['plans'],
      },
      links: {
        fields: ['plan_id', 'id'],
        links: [
          'gateways',
          'users',
          'invoices',
          'credits',
          'plans',
        ],
      },
      'id,name,links.users': {
        fields: ['id', 'name', 'plan_id'],
        links: ['users', 'plans'],
      },
      'id,name,config.name,config.type': {
        fields: [
          'id',
          'name',
          'config.name',
          'config.type',
          'plan_id',
        ],
        links: ['plans'],
      },
    };

    loForEach(list, (v, k) => {
      it(`should return ${JSON.stringify(v)} for \`${k}\``, () => {
        expect(Prepare.fields(require(`${parentPath}/models/organisations`), k)).toEqual(v);
      });
    });
  });

  describe('prepare.orderBy', () => {
    const cls = {
      FIELDS: [],
    };

    beforeEach(() => {
    });

    it('should return empty string', () => {
      cls.FIELDS = ['a', 'b', 'c', 'd'];
      expect(Prepare.orderBy(cls, '')).toEqual([]);
    });

    it('should return empty string (default value)', () => {
      cls.FIELDS = ['a', 'b', 'c', 'd'];
      expect(Prepare.orderBy(cls)).toEqual([]);
    });

    it('should cleanup the fields (if csv format provided)', () => {
      cls.FIELDS = ['a', 'b', 'c', 'd'];
      expect(Prepare.orderBy(cls, 'a,b,cc')).toEqual(['a', 'b']);
    });

    it('should work with negative sign to define DESC', () => {
      cls.FIELDS = ['a', 'b', 'c', 'd'];
      expect(Prepare.orderBy(cls, '-a,b,cc')).toEqual(['-a', 'b']);
    });
  });

  describe('prepare.page', () => {
    let cls;

    beforeEach(() => {
      cls = {
        PAGESIZE: 75,
      };
    });

    it('should default to first page (0, 75) when page is 0', () => {
      expect(Prepare.page(cls, { page: 0 })).toEqual({ from: undefined, limit: 75 });
    });

    it('should default to first page (0, 75) when no values provided', () => {
      expect(Prepare.page(cls, {})).toEqual({ from: undefined, limit: 75 });
    });

    it('should override default PAGESIZE, and calculate limit offset and number of objects', () => {
      const pageSize = 10;
      expect(Prepare.page(cls, { page: 2, size: pageSize })).toEqual({ from: 10, limit: pageSize });
    });

    it('should override default PAGESIZE, and if page not provided it should default `undefined`', () => {
      const pageSize = 7;
      expect(Prepare.page(cls, { page: null, size: pageSize })).toEqual({ from: undefined, limit: pageSize });
    });
  });
});
