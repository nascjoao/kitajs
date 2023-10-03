import {
  BodyInGetRequestError,
  InvalidParameterUsageError,
  KitaConfig,
  ParameterConflictError,
  ParameterParser,
  Route
} from '@kitajs/common';
import type ts from 'typescript';
import type { SchemaBuilder } from '../schema/builder';
import { mergeSchema } from '../schema/helpers';
import { kRequestParam } from '../util/constants';
import {
  getParameterGenerics,
  getParameterName,
  getTypeNodeName,
  isParamOptional,
  toPrettySource
} from '../util/nodes';
import { buildAccessProperty } from '../util/syntax';

export class BodyPropParameterParser implements ParameterParser {
  agnostic = false;

  constructor(
    private config: KitaConfig,
    private schema: SchemaBuilder
  ) {}

  supports(param: ts.ParameterDeclaration) {
    return getTypeNodeName(param) === 'BodyProp';
  }

  parse(param: ts.ParameterDeclaration, route: Route) {
    const prettyPath = toPrettySource(param);

    if (route.method === 'GET') {
      throw new BodyInGetRequestError(prettyPath);
    }

    // The $ref property is set when using the Body parameter
    if (route.schema.body?.$ref) {
      throw new ParameterConflictError('Body', 'BodyProp', route.schema.body);
    }

    const [type] = getParameterGenerics(param);

    if (!type) {
      throw new InvalidParameterUsageError(
        'BodyProp',
        'You must specify a type for the BodyProp parameter.',
        prettyPath
      );
    }

    const name = getParameterName(param, 1);

    if (name.includes('.')) {
      throw new InvalidParameterUsageError(
        'BodyProp',
        'You cannot have dots in the BodyProp name. Use the Body parameter for deep objects.',
        prettyPath
      );
    }

    const optional = isParamOptional(param);

    mergeSchema(route, {
      body: {
        type: 'object',
        properties: { [name]: this.schema.consumeNodeSchema(type) },
        required: optional ? [] : [name],
        additionalProperties: this.config.schema.generator.additionalProperties
      }
    });

    return {
      value: buildAccessProperty(kRequestParam, 'body', name)
    };
  }
}