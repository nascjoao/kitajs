import assert from 'node:assert';
import test, { describe } from 'node:test';
import path from 'path';
import { parseRoutes } from '../runner';

describe('Cookies', async () => {
  const kita = await parseRoutes(__dirname);

  test('expects 2 routes were generated', () => {
    assert.equal(kita.getProviderCount(), 0);
    assert.equal(kita.getRouteCount(), 4);
  });

  test('default path usage', () => {
    const route = kita.getRoute('getName');

    assert.deepStrictEqual(route, {
      url: '/:name',
      controllerMethod: 'get',
      method: 'GET',
      controllerName: 'NameController',
      controllerPath: path.resolve(__dirname, 'routes/[name].ts'),
      controllerPrettyPath: 'test/paths/routes/[name].ts:3:1',
      parameters: [{ value: 'req.params.name' }],
      schema: {
        params: {
          type: 'object',
          properties: { name: { type: 'string' } },
          required: ['name'],
          additionalProperties: undefined
        },
        response: { default: { type: 'string' } },
        operationId: 'getName'
      }
    });
  });

  test('default path usage with custom name', () => {
    const route = kita.getRoute('postName');

    assert.deepStrictEqual(route, {
      url: '/:name',
      controllerMethod: 'post',
      method: 'POST',
      controllerName: 'NameController',
      controllerPath: path.resolve(__dirname, 'routes/[name].ts'),
      controllerPrettyPath: 'test/paths/routes/[name].ts:7:1',
      parameters: [{ value: 'req.params.name' }],
      schema: {
        params: {
          type: 'object',
          properties: { name: { type: 'string' } },
          required: ['name'],
          additionalProperties: undefined
        },
        response: { default: { type: 'string' } },
        operationId: 'postName'
      }
    });
  });

  test('default path with custom type', () => {
    const route = kita.getRoute('getNum');

    assert.deepStrictEqual(route, {
      url: '/:num',
      controllerMethod: 'get',
      method: 'GET',
      controllerName: 'NumController',

      controllerPath: path.resolve(__dirname, 'routes/[num].ts'),
      controllerPrettyPath: 'test/paths/routes/[num].ts:3:1',
      parameters: [{ value: 'req.params.num' }],
      schema: {
        params: {
          type: 'object',
          properties: { num: { type: 'number' } },
          required: ['num'],
          additionalProperties: undefined
        },
        response: { default: { type: 'number' } },
        operationId: 'getNum'
      }
    });
  });

  test('default path with custom type and name', () => {
    const route = kita.getRoute('postNum');

    assert.deepStrictEqual(route, {
      url: '/:num',
      controllerMethod: 'post',
      method: 'POST',
      controllerName: 'NumController',
      controllerPath: path.resolve(__dirname, 'routes/[num].ts'),
      controllerPrettyPath: 'test/paths/routes/[num].ts:7:1',
      parameters: [{ value: 'req.params.num' }],
      schema: {
        params: {
          type: 'object',
          properties: { num: { type: 'number' } },
          required: ['num'],
          additionalProperties: undefined
        },
        response: { default: { type: 'number' } },
        operationId: 'postNum'
      }
    });
  });
});